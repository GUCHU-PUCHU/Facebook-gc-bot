var fse = require('fs-extra');
var path = require('path');
var login = require('facebook-chat-api');
var config = require('./data/config.json');
var log = require('./data/log.json');
var gInfo = require('./data/gInfo.json');
var utils = require('./utils');

// Start of Command Files Handler
let cmdMap: any = new Map();
cmdMap.name = new Map();
cmdMap.alias = new Map();

fse.readdirSync(path.join(__dirname, 'cmd')).forEach((file: string) => {
	if (file.endsWith('.js')) {
		let cmd = require(path.join(__dirname, 'cmd', file));
		cmdMap.name.set(cmd.name, cmd);
		if (cmd.alias) {
			cmd.alias.forEach((alias: string) => {
				cmdMap.alias.set(alias, cmd);
			});
		} else {
			cmdMap.alias.set(cmd.name, cmd);
		}
	}
});

console.log('Loaded ' + cmdMap.name.size + ' commands.');
console.log('Commands:\n' + Array.from(cmdMap.name.keys()).join(', '));

// End of Command Files Handler

const credentials = {
	appState: JSON.parse(fse.readFileSync(path.join(__dirname, 'data/appState.json'), 'utf8')),
};

let talkedRecently: any = new Set();
// Login
login(credentials, (err: any, api: any) => {
	if (err) return console.error(err);
	api.setOptions({
		selfListen: false,
		logLevel: 'silent',
	});
	// Listen for messages
	api.listenMqtt((err: any, message: any) => {
		if (err) return console.error(err);
		fse.writeFileSync(path.join(__dirname, 'data/appState.json'), JSON.stringify(api.getAppState(), null, 4));
		console.log(message);
		if (message.type === 'message' || message.type === 'message_reply') {
			// Message logging
			require('./events/log')(message);

			// Thread info logging
			api.getThreadInfo(message.threadID, (err: any, info: any) => {
				if (err) return console.error(err);
				gInfo[message.threadID] = info;
				fse.writeFileSync(path.join(__dirname, 'data/gInfo.json'), JSON.stringify(gInfo, null, 4));
			});
			// End of thread info logging

			// Command Handler (this is where the 'magic' happens)
			// check if Group-chat lock is enabled
			if (config.gc_lock && config.thread_id !== message.threadID)
				return console.log('Ignoring message from ' + message.threadID);

			// if mentioned
			require('./events/mentioned')(api, message);

			if (!message.body.startsWith(config.prefix)) return;
			const args = message.body.slice(config.prefix.length).trim().split(/ +/g);
			let cmd = args.shift().toLowerCase();
			// check if command exists
			if (!cmdMap.name.has(cmd)) {
				if (cmdMap.alias.has(cmd)) {
					cmd = cmdMap.alias.get(cmd).name;
				} else {
					return;
				}
			}

			// check if commands is Group-chat only
			if (cmdMap.name.get(cmd).GcOnly && !message.isGroup) return;

			// check if command's cooldown is enabled
			if (cmdMap.name.get(cmd).cooldown) {
				if (!talkedRecently[message.threadID]) {
					talkedRecently[message.threadID] = new Set();
				}
				if (talkedRecently[message.threadID].has(message.senderID)) {
					return;
				}
				talkedRecently[message.threadID].add(message.senderID);
				setTimeout(() => {
					talkedRecently[message.threadID].delete(message.senderID);
				}, config.cooldown * 1000);
			}

			// check if command needs arguments
			if (cmdMap.name.get(cmd).args && args.length === 0) {
				let reply = 'You need to provide arguments for this command.';
				if (cmdMap.name.get(cmd).usage) {
					reply += '\nUsage: ' + config.prefix + cmd + ' ' + cmdMap.name.get(cmd).usage;
				}
				api.sendMessage(reply, message.threadID);
				return;
			}
			api.setMessageReaction('👀', message.messageID);
			// execute command
			try {
				cmdMap.name.get(cmd).execute(api, message, args, utils, cmdMap);
			} catch (error) {
				utils.failReact(api, message.messageID);
				api.sendMessage('Something went wrong!', message.threadID);
				console.error(error);
			}
		}
	});
});
