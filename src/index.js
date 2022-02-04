const fs = require('fs-extra');
const login = require('facebook-chat-api');
var log = require('npmlog');
const {
	prefix
} = require('./config.json')


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
log.info('Commands loaded!\n  >>>',data.join(', '));

// Login
let fbCookiesStored = false;
log.info('login', 'Attempting to log in');
login(credentials, (err, api) => {
	if (err) log.error('Warning!', err);
	api.listenMqtt((err, message) => {
		if (err) log.error('Listen Api error!', err);

		// checks if there's a stored cookies in ./data
		else {
			if (!fbCookiesStored) {
				fs.writeFileSync(`${__dirname}/data/fbCookies.json`, JSON.stringify(api.getAppState()));
				fbCookiesStored = true;
			}

			// Bot interaction starts here
			if (message.type === 'message') {
				if (message.isGroup) return;
				if (!message.body.startsWith(prefix)) return; // Checks if the message starts with the given prefix.
				api.setMessageReaction('\uD83D\uDC4D', message.messageID);

				const args = message.body.slice(prefix.length).trim().split(/ +/); // Seperates the prefix from the command.
				const cmdName = args.shift().toLowerCase();
				const command = cmdMap.commands.get(cmdName);

				if (!command) return; // If command doesn't exist.. ignore

				// This bit of code checks if the command needs a parameter in order to execute.
				// This checks for 'args':boolean in command.
				if (command.args && !args.length) {
					let reply = 'You didn\'t provide any arguments!';

					if (command.usage) {
						reply += `\nThe proper ussage would be: \`${prefix}${command.name} ${command.usage}\``;
					}

					api.sendMessage(reply, message.threadID);
					return;
				}

				api.markAsRead(message.threadID);
				api.setMessageReaction('\uD83D\uDC4D', message.messageID);

				// This bit of code executes the command.
				try {
					command.execute(api, message, args, cmdMap, __dirname);
				} catch (err) {
					log.error('Something is wrong executing the command! \n', err);
				}

			}
		}
	})
})