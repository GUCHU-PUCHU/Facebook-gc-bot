var config = require('../config.json');
var utils = require('../utils');
var fs = require('fs');
var log = require('npmlog');

module.exports = {
	name: 'set',
	description: "Set bot's config",
	usage: '< prefix | botname | response | threadID | apiKey | gcLock > [value]',
	adminOnly: true,
	args: false,
	hidden: false,
	cooldown: true,
	async execute(api, message, args) {
		let key = args[0];
		let value = args.slice(1).join(' ');
		utils.lookReact(api, message.threadID);

		if (
			(key === 'prefix' || key === 'botname' || key === 'response' || key === 'apiKey') &&
			value.length > 0
		) {
			config[key] = value;
			fs.writeFile('../config.json', JSON.stringify(config), (err) => {
				if (err) {
					log.error('Set', err);
					return api.sendMessage(
						'Something went wrong. Please try again.',
						message.threadID
					);
				}
				utils.successReact(api, message.messageID);
				return api.sendMessage(
					'Successfully set ' + key + ' to ' + value,
					message.threadID
				);
			});
		}

		if (key === 'threadID') {
			if (!value.match(/^\d+$/) || value.length !== 16) {
				utils.errorReact(api, message.messageID);
				return api.sendMessage('Invalid thread ID.', message.threadID);
			}
			config.threadID = value;
			utils.successReact(api, message.messageID);
		}

		if (key === 'gcLock') {
			if (value === 'true') {
				value = true;
				api.setMessageReaction('🔒', message.messageID);
			}
			if (value === 'false') {
				value = false;
				api.setMessageReaction('🔓', message.messageID);
			}
			if (config.gcLock == value) {
				utils.noticeReact(api, message.messageID);
				return api.sendMessage('Nothing changed.', message.threadID);
			}
			if (typeof value !== 'boolean') {
				utils.errorReact(api, message.messageID);
				return api.sendMessage('Invalid value. must be true or false.', message.threadID);
			}
			config.gcLock = value;
		}

		if (key === 'status') {
			let data = [];
			data.push('Current Bot Configuration:');
			for (let key in config) {
				if (key === 'Imgflip') continue;

				if (config.hasOwnProperty(key)) {
					data.push(key + ': ' + config[key]);
				}
			}
			api.sendMessage(data.join('\n'), message.threadID);
		}

		fs.writeFileSync('../config.json', JSON.stringify(config, null, 2), (err) => {
			if (err) {
				api.sendMessage(`Error: can't set ${key} to ${value}`, message.threadID);
				utils.noticeReact(api, message);
				return log.error(err);
			}
			utils.successReact(api, message.messageID);
		});
	},
};
