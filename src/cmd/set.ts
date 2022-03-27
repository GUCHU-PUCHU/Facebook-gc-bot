module.exports = {
	name: 'set',
	alias: ['set', 'config', 'cfg'],
	args: true,
	adminOnly: true,
	GcOnly: true,
	usage: '[ prefix | botname | response | apikey | cooldown ] <value>',
	description: 'This command is used to set a setting for the bot.',
	info: "Set bot's settings.",
	cooldown: true,
	execute: function (
		api: { sendMessage: (arg0: string, arg1: any) => void; setMessageReaction: (arg0: string, arg1: any) => void },
		message: { threadID: any; messageID: any },
		args: any[],
		config: { [x: string]: any },
		utils: {
			writeToConfig: (arg0: { [x: string]: any }, arg1: () => void) => void;
			successReact: (
				arg0: {
					sendMessage: (arg0: string, arg1: any) => void;
					setMessageReaction: (arg0: string, arg1: any) => void;
				},
				arg1: any
			) => void;
		}
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

		config[key] = value;
		utils.writeToConfig(config, () => {
			utils.successReact(api, message.messageID);
			api.sendMessage(`Setting ${key} to ${value}`, message.threadID);
		});
	},
};
