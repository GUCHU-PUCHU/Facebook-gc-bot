const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));
var utils = require('../utils');

module.exports = {
	name: 'urban',
	description: 'Search urban dictionary!',
	usage: '[search term]',
	adminOnly: false,
	args: false,
	hidden: false,
	cooldown: true,
	async execute(api, message, args) {
		if (!args.length) {
			utils.noticeReact(api, message.messageID);
			api.sendMessage(
				"You're searching what? Please use the command properly!",
				message.threadID
			);
			return;
		}

		const term = args;
		const query = new URLSearchParams({
			term,
		});

		const { list } = await fetch(
			`https://api.urbandictionary.com/v0/define?${query}`
		).then((response) => response.json());

		if (!list.length) {
			utils.sadReact(api, message.messageID);
			api.sendMessage(
				`No results for: ${term.join(' ')}!`,
				message.threadID
			);
			return;
		}

		const [answer] = list;

		api.sendMessage(
			`Result for: ${term.join(' ')}\n\n` +
				`Definition: ${answer.definition}\n\n` +
				`Example: ${answer.example}`,
			message.threadID
		);
	},
};
