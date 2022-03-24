module.exports = {
	name: 'test',
	description: 'test',
	usage: 'test',
	adminOnly: false,
	args: false,
	hidden: true,
	cooldown: true,
	async execute(api, message) {
		api.sendMessage('test', message.threadID);
	},
};
