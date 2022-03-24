var utils = require('../utils');

const { prefix } = require('../config');

module.exports = {
	name: 'help',
	description: 'display commands!',
	usage: '[command name?]',
	adminOnly: false,
	args: false,
	hidden: false,
	cooldown: true,
	async execute(api, message, args, cmdMap) {
		let x = [];

		if (args.length > 0) {
			const cmd = cmdMap.commands.get(args[0].toLowerCase());
			console.log(cmd);
			if (!cmd) {
				utils.noticeReact(api, message.messageID);
				return api.sendMessage(
					'No command found.\n' +
						'Use `' +
						prefix +
						'help [command name]` to view more info.',
					message.threadID
				);
			}
			utils.successReact(api, message.messageID);
			x.push(cmd.name);
			if (cmd.description) x.push('\t:' + cmd.description);
			if (cmd.usage) x.push('Usage:\n\t' + prefix + cmd.name + ' ' + cmd.usage);
			if (cmd.adminOnly) x.push('Admin Only: true');
			if (cmd.args) x.push('Args: true');
			if (cmd.hidden) x.push('Hidden: true');
			if (cmd.cooldown) x.push('Cooldown: true');
			return api.sendMessage(x.join('\n'), message.threadID);
		}

		utils.successReact(api, message.messageID);
		x.push('Commands:');
		let i = 0;
		for (const [key, value] of cmdMap.commands) {
			x.push('*' + key + '*');
			x.push('\t: ' + value.description);
			if (value.usage) x.push('Usage:\n\t' + prefix + key + ' ' + value.usage);
			if (value.adminOnly) x.push('Admin Only: true');
			if (value.args) x.push('Args: true');
			if (value.hidden) x.push('Hidden: true');
			if (value.cooldown) x.push('Cooldown: true');
			x.push('+==+==+');
			i++;
			if (i % 10 === 0) {
				await api.sendMessage(x.join('\n'), message.threadID);
				x = [];
			}
		}
		if (x.length > 0) await api.sendMessage(x.join('\n'), message.threadID);
	},
};
