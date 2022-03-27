module.exports = {
	name: 'urban',
	alias: ['urban', 'urbandictionary', 'ud'],
	args: true,
	adminOnly: false,
	GcOnly: true,
	usage: '<term>',
	description: 'Search for a term on Urban Dictionary.',
	info: 'Search for a term on Urban Dictionary.',
	cooldown: true,
	execute: function (
		api: { sendMessage: (arg0: string, arg1: any) => void },
		message: { threadID: any },
		args: any[]
	) {
		var fetch = require('node-fetch');
		let x: any[] = [];
		let term = args.join(' ');
		fetch(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`)
			.then((res: { json: () => any }) => res.json())
			.then((json: { list: string | any[] }) => {
				if (json.list.length === 0) {
					return api.sendMessage(`No results found for \`${term}\`.`, message.threadID);
				}
				let result = json.list[0];
				x.push('*' + result.word + '*');
				x.push('Definition:\n\t' + result.definition);
				x.push('Example:\n' + result.example);
				x.push('Link:\n\t' + result.permalink);
				api.sendMessage(x.join('\n\n'), message.threadID);
			});
	},
};
