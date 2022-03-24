var fs = require('fs-extra');
var utils = require('../utils');

module.exports = {
	name: 'help',
	description: 'display commands!',
	usage: '[command name?]',
	adminOnly: false,
	args: false,
	hidden: false,
	cooldown: true,
	async execute(api, message, args, cmdMap, __dirname) {
		fs.readdir(__dirname + `/commands`, (err, files) => {
			if (err) console.error(err);

			const jsFiles = files.filter((file) => file.endsWith('.js'));
			const { prefix } = require(__dirname + `/config.json`);

			if (jsFiles.length <= 0) {
				console.log('no commands found!');
				return;
			}

			const data = [];

			if (args.length > 0) {
				const command = cmdMap.commands.get(args[0].toLowerCase());
				if (!command) {
					utils.noticeReact(api, message.messageID);
					api.sendMessage(
						`Command \`${args[0]}\` not found!`,
						message.threadID
					);
					return;
				}

				utils.successReact(api, message.messageID);
				data.push(`Name: ${command.name}`);
				data.push(`Description: ${command.description}`);
				if (command.adminOnly)
					data.push(`Admin Only: ${command.adminOnly}`);
				if (command.hasOwnProperty('args'))
					data.push(`Arguments: ${command.args}`);
				if (command.hasOwnProperty('usage'))
					data.push(
						`Usage: ${prefix}${command.name} ${command.usage}`
					);
				return api.sendMessage(data.join('\n'), message.threadID);
			} else {
				utils.successReact(api, message.messageID);
				data.push('Here are some commands:\n');

				cmdMap.commands.forEach((command) => {
					// if (command.adminOnly && !message.senderID === api.getCurrentUserID()) return;
					if (command.hidden) return;
					data.push(`Name: ${command.name}`);
					data.push(`Description: ${command.description}`);
					if (command.adminOnly)
						data.push(`Admin Only: ${command.adminOnly}`);
					if (command.hasOwnProperty('args'))
						data.push(`Arguments: ${command.args}`);
					if (command.hasOwnProperty('usage'))
						data.push(
							`Usage: ${prefix}${command.name} ${command.usage}`
						);
					if (command.hasOwnProperty('cooldown'))
						data.push(`Cooldown: ${command.cooldown}`);
					data.push('=================');
				});
			}

			api.sendMessage(
				`I sent the commands in your DM! If you can't find it check your message request.`,
				message.threadID
			);
			utils.splitMessage(data.join('\n'), 1000).forEach((msg) => {
				api.sendMessage(msg, message.senderID);
				utils.sleep(2000);
			});
		});
	},
};
