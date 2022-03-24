module.exports = {
	name: 'test',
	description: 'test',
	usage: 'test',
	adminOnly: false,
	args: false,
	hidden: true,
	cooldown: true,
	async execute(api, message, args) {
		let arr = {
			mon: ['a', 'b', 'c'],
			wed: ['d', 'e', 'f'],
			fri: ['g', 'h', 'i'],
		};

		let x = [];

		if (!arr.hasOwnProperty(args[0])) {
			return api.sendMessage('Please use the proper parameters!', message.threadID);
		}

		for (let i = 0; i < arr[args[0]].length; i++) {
			x.push(arr[args[0]][i]);
		}

		api.sendMessage(x.join('\n'), message.threadID);
	},
};
