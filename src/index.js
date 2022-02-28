const fs = require('fs-extra');
const login = require('facebook-chat-api');
var log = require('npmlog');
var utils = require('./utils');
const config = require('./config.json');

// Load credentials from cookies
const credentials = {
	appState: JSON.parse(fs.readFileSync(__dirname + `/data/fbCookies.json`, 'utf8')),
};

// Intializing Commands
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

// Login
let fbCookiesStored = false;
log.info('login', 'Attempting to log in');
login(credentials, (err, api) => {
	if (err) log.error('Warning!', err);
	api.listenMqtt((err, message) => {
		if (err) return log.error('Listen Api error!', err);

		else {
			// checks if there's a stored cookies in ./data/fbCookies.json
			if (!fbCookiesStored) {
				fs.writeFileSync(`${__dirname}/data/fbCookies.json`, JSON.stringify(api.getAppState()));
				fbCookiesStored = true;
			}

			// Bot interaction starts here
			if (message.type === 'message') {
				console.log(message);
				if (!message.isGroup) return;
				// checks if the thread ID is the same as the one in the config file if not then ignore.
				// This is to prevent the bot from responding to other threads.
				// This can be configured in the config file.
				
				if (config.gcLock) {
					if (config.threadID !== message.threadID) {
						return log.error('Warning!', 'Received message from another chat! ThreadID does not match!');
					}
				}

				if (message.body.toLowerCase().includes('@' + config.botName)) {
					log.info('Interaction', 'Name was mentioned!');
					utils.eyesReact(api, message.messageID);
					let res = [];
					const x = config.botName.toUpperCase().charAt(0) + config.botName.slice(1);

					res.push(`Hello, I'm ${x}. My prefix is: \`${config.prefix}\``);
					res.push(`You can view my commands by typing \`${config.prefix}help\` \n`);

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

				// This bit of code checks if the command needs an arguments in order to execute.
				// This checks for 'args':boolean in command.
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
				// api.setMessageReaction('👍', message.messageID);
				// This bit of code executes the command.
				try {
					command.execute(api, message, args, cmdMap, __dirname, config);
				} catch (error) {
					log.error('Something is wrong executing the command! \n', error);
					utils.noticeReact(api, message.messageID);
				}
			}
		}
	});
});