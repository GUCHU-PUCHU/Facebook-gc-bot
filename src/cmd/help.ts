module.exports = {
	name: 'help',
	alias: ['help', 'h'],
	args: false,
	adminOnly: false,
	GcOnly: true,
	usage: '[command]',
	description: 'Do you need help? figuring out how to use a command? this is the command for you.',
	info: 'To display help.',
	cooldown: true,
	execute: function (
		api: { sendMessage: (arg0: string, arg1: any) => void },
		message: { threadID: any; senderID: any },
		args: string | any[],
		config: { prefix: string },
		utils: any,
		cmdMap: {
			name: {
				has: (arg0: any) => any;
				get: (arg0: any) => { (): any; new (): any; description: string; info: String; usage: string };
				keys: () => any;
			};
			alias: { has: (arg0: any) => any; get: (arg0: any) => { (): any; new (): any; name: any } };
		}
	) {
		if (args.length === 0) {
			let reply = 'Available commands:';
			for (let key of cmdMap.name.keys()) {
				reply += '\n' + config.prefix + key + '\n  ⌎| ' + cmdMap.name.get(key).info + '\n';
			}
			reply += '\n\nFor more info on a command, type `' + config.prefix + 'help [command]`';
			if (message.senderID !== message.threadID)
				api.sendMessage(
					'List of commands were sent to your DMs! Please kindly check them out',
					message.threadID
				);
			utils.sendMessage(reply, api, message.senderID, { limit: 1000, delay: 1 });
			return;
		}
		let cmd = args[0].toLowerCase();
		if (!cmdMap.name.has(cmd)) {
			if (cmdMap.alias.has(cmd)) {
				cmd = cmdMap.alias.get(cmd).name;
			} else {
				return;
			}
		}
		let reply = 'Command: ' + config.prefix + cmd;
		if (cmdMap.name.get(cmd).description) {
			reply += '\nDescription: ' + cmdMap.name.get(cmd).description;
		}
		if (cmdMap.name.get(cmd).usage) {
			reply += '\nUsage: ' + config.prefix + cmd + ' ' + cmdMap.name.get(cmd).usage;
		}
		api.sendMessage(reply, message.threadID);
	},
};
