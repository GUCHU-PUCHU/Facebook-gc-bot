var fs = require('fs-extra');
var login = require('facebook-chat-api');
var log = require('npmlog');
var utils = require('./utils');
var config = require('./config.json');
const credentials = {
	appState: JSON.parse(fs.readFileSync(__dirname + `/data/fbCookies.json`, 'utf8')),
};
const cmdMap = new Map();
cmdMap.commands = new Map();
const data = [];

log.info('Loading Commands... ');
const commandFiles = fs.readdirSync(__dirname + `/commands`).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	cmdMap.commands.set(command.name, command);
	data.push(command.name);
}
log.info('Commands loaded!\n  >>>', data.join(', '));

let fbCookiesStored = false;
const talkedRecently = new Set();

log.info('login', 'Attempting to log in');
login(credentials, (err, api) => {
	if (err) log.error('Warning!', err);

	else {
		log.info('mqtt', 'Listening for MQTT messages...'); 
		api.listenMqtt((err, message) => {
			if (err) return log.error('Listen Api error!', err);
	
			if (!fbCookiesStored) {
				fs.writeFileSync(__dirname + `/data/fbCookies.json`, JSON.stringify(api.getAppState(), null, 4));
				fbCookiesStored = true;
			}
	
			else {
				// Bot interaction starts here
				if (message.type === 'message') {
					console.log(message);
					if (!message.isGroup) return;
	
					if (config.gcLock) {
						if (config.threadID !== message.threadID) {
							return log.error('Warning!', 'Received message from another chat! ThreadID does not match!');
						}
					}
	
					if (message.body.toLowerCase().includes('@' + config.botName)) {
						log.info('Interaction', 'Name was mentioned!');
						utils.eyesReact(api, message.messageID);
						let res = [];
	
						if (config.response) res.push(config.response);
						utils.splitMessage(res.join('\n'), 1000).forEach((msg) => {
							api.sendMessage(msg, message.threadID);
						});
					}
	
					if (!message.body.startsWith(config.prefix)) return; // Checks if the message starts with the given config.prefix.
					const args = message.body.slice(config.prefix.length).trim().split(/ +/); // Seperates the config.prefix from the command.
					const cmdName = args.shift().toLowerCase();
					const command = cmdMap.commands.get(cmdName);
	
					if (!command) return; // If command doesn't exist.. ignore.
					log.info('Interaction!', `Command	: ${message.body} \nSender ID	: ${message.messageID} \nThread ID	: ${message.threadID}`);

					// cooldown
					if (command.cooldown) {
						if (talkedRecently.has(message.senderID)) {
							return;
						}
						talkedRecently.add(message.senderID);
						setTimeout(() => {
							talkedRecently.delete(message.senderID);
						}, 5000);
					}

					if (command.args && !args.length) {
						let reply = 'You didn\'t provide any arguments!';
						if (command.usage) {
							reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
						}
						api.sendMessage(reply, message.threadID);
						utils.noticeReact(api, message.messageID);
						return;
					}
	
					api.markAsRead(message.threadID);
					api.setMessageReaction('👍', message.messageID);
					try {
						command.execute(api, message, args, cmdMap, __dirname, config);
					} catch (error) {
						log.error('Something is wrong executing the command! \n', error);
						utils.noticeReact(api, message.messageID);
					}
				}
			}
		});
	}
});