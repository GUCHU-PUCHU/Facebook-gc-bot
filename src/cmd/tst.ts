module.exports = {
	name: 'tst',
	alias: ['tst', 'test'],
	args: false,
	adminOnly: false,
	GcOnly: false,
	usage: '[command]',
	description: 'test',
	info: 'for testing purposes',
	hidden: true,
	cooldown: true,
	execute: function (api: { setMessageReaction: (arg0: string, arg1: any) => void }, message: { messageID: any }) {
		api.setMessageReaction('👍', message.messageID);
	},
};
