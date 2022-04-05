var fse = require('fs-extra');
var path = require('path');
var config = require('../data/config');
module.exports = {
	name: 'set',
	alias: ['set', 'config', 'cfg'],
	args: true,
	adminOnly: true,
	GcOnly: true,
	usage: '[ prefix | botname | response | apikey | cooldown ] <value> | [stats]',
	description:
		'Set the value of a config option.\n' +
		'Usage: `!set [option] [value]`\n\n' +
		'Available options:\n' +
		' - prefix: The prefix of the bot.\n' +
		' - botname: The name of the bot.\n' +
		' - response: The response of the bot.\n' +
		' - apikey: The api key of the bot.\n' +
		' - cooldown: The cooldown of the bot.\n' +
		' - stats: The stats of the bot.\n',
	info: "Set bot's settings.",
	cooldown: true,
	execute: function (
		api: { sendMessage: (arg0: string, arg1: any) => void; setMessageReaction: (arg0: string, arg1: any) => void },
		message: { threadID: any; messageID: any },
		args: any[],
		utils: { successReact: (arg0: any, arg1: any) => void }
	) {
		let key: string = args[0];
		let value: any = args.slice(1).join(' ');

		if (key === 'prefix') key = 'prefix';
		if (key === 'botname') key = 'bot_name';
		if (key === 'response') key = 'response';
		if (key === 'apikey') key = 'w_api_key';
		if (key === 'cooldown') {
			if (isNaN(value)) {
				api.sendMessage('Cooldown must be a number.', message.threadID);
				return;
			}
			if (value < 0) {
				api.sendMessage('Cooldown must be a positive number.', message.threadID);
				return;
			}
			if (value > 3600) {
				api.sendMessage('Cooldown must be less than 3600.', message.threadID);
				return;
			}
			key = 'cooldown';
			value = parseInt(value);
		}
		if (key === 'threadid') {
			if (isNaN(value)) {
				return api.sendMessage('Thread ID must be a number.', message.threadID);
			}
			key = 'thread_id';
		}

		if (key === 'gclock') {
			if (value === 'true') {
				api.setMessageReaction('🔒', message.messageID);
				value = true;
			} else if (value === 'false') {
				api.setMessageReaction('🔓', message.messageID);
				value = false;
			} else {
				return api.sendMessage('Value must be true or false.', message.threadID);
			}
			key = 'gc_lock';
		}
		if (key === 'stats' || key === 'stat' || key === 'status') {
			// send the stats in config file
			let msg =
				'Config Stats:\n' +
				'\tPrefix: ' +
				config.prefix +
				'\n' +
				'\tBot Name: ' +
				config.bot_name +
				'\n' +
				'\tResponse: ' +
				config.response +
				'\n' +
				'\tAPI Key: ' +
				config.w_api_key +
				'\n' +
				'\tCooldown: ' +
				config.cooldown +
				'\n' +
				'\tGroup Chat Lock: ' +
				config.gc_lock +
				'\n' +
				'\tThread ID: ' +
				config.thread_id;
			api.sendMessage(msg, message.threadID);
			return;
		}

		if (!value) return;

		config[key] = value;

		// write to config file
		fse.writeJson(path.join(__dirname, '../data/config.json'), config, { spaces: 2 }, (err: any) => {
			if (err) {
				api.sendMessage('Error writing to config file.', message.threadID);
				return;
			}
			api.setMessageReaction('⚙️', message.messageID);
		});
	},
};
