'use strict';
var fse = require('fs-extra');
var path = require('path');
var login = require('facebook-chat-api');
var config = require('./data/config.json');
var utils = require('./utils');
let cmdMap = new Map();
cmdMap.name = new Map();
cmdMap.alias = new Map();
fse.readdirSync(path.join(__dirname, 'cmd')).forEach((file) => {
	if (file.endsWith('.js')) {
		let cmd = require(path.join(__dirname, 'cmd', file));
		cmdMap.name.set(cmd.name, cmd);
		if (cmd.alias) {
			cmd.alias.forEach((alias) => {
				cmdMap.alias.set(alias, cmd);
			});
		} else {
			cmdMap.alias.set(cmd.name, cmd);
		}
	}
});
console.log('Loaded ' + cmdMap.name.size + ' commands.');
console.log('Commands:\n' + Array.from(cmdMap.name.keys()).join('\n'));
const credentials = {
	appState: JSON.parse(fse.readFileSync(path.join(__dirname, 'data/appState.json'), 'utf8')),
};
let talkedRecently = new Set();
login(credentials, (err, api) => {
	if (err) return console.error(err);
	api.setOptions({
		selfListen: false,
		logLevel: 'silent',
	});
	api.listenMqtt((err, message) => {
		if (err) return console.error(err);
		fse.writeFileSync(path.join(__dirname, 'data/appState.json'), JSON.stringify(api.getAppState(), null, 4));
		if (message.type === 'message') {
			console.log(message);
			if (config.gc_lock) {
				if (config.thread_id !== message.threadID)
					return console.log('Ignoring message from ' + message.threadID);
			}
			if (config.response.length > 0) {
				if (message.body.toLowerCase().includes('@' + config.bot_name.toLowerCase())) {
					api.sendMessage(config.response, message.threadID);
				}
			}
			if (!message.body.startsWith(config.prefix)) return;
			const args = message.body.slice(config.prefix.length).trim().split(/ +/g);
			let cmd = args.shift().toLowerCase();
			if (!cmdMap.name.has(cmd)) {
				if (cmdMap.alias.has(cmd)) {
					cmd = cmdMap.alias.get(cmd).name;
				} else {
					return;
				}
			}
			if (cmdMap.name.get(cmd).GcOnly && !message.isGroup) return;
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
			if (cmdMap.name.get(cmd).args && args.length === 0) {
				let reply = 'You need to provide arguments for this command.';
				if (cmdMap.name.get(cmd).usage) {
					reply += '\nUsage: ' + config.prefix + cmd + ' ' + cmdMap.name.get(cmd).usage;
				}
				api.sendMessage(reply, message.threadID);
				return;
			}
			api.setMessageReaction('👍', message.messageID);
			try {
				cmdMap.name.get(cmd).execute(api, message, args, config, utils, cmdMap);
			} catch (error) {
				console.error(error);
			}
		}
	});
});
