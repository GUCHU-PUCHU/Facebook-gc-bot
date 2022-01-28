const fetch = (...args) => import('node-fetch').then(({
	default: fetch,
}) => fetch(...args));

module.exports = {
	name: 'urban',
	description: 'Search urban dictionary!',
	args: true,
	adminOnly: false,
	usage: '[search query]',
	async execute(api, message, args) {
		if (!args.length) {
			api.sendMessage("You're searching what? Please use the command properly!", message.threadID);
			return;
		}

		const term = args;
		const query = new URLSearchParams({
			term,
		});

		const {
			list,
		} = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then((response) => response.json());

		if (!list.length) {
			api.sendMessage(`No results from ${term}!`, message.threadID);
			return;
		}

		const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
		const [answer] = list;
		const data = [];

		data.push(`Results for "${term}"`);
		data.push(`Definition: \n${trim(answer.definition, 1024)}\n`);
		data.push(`Examples: \n${trim(answer.example, 1024)}`);

		api.sendMessage(data.join('\n '), message.threadID);
	},
};