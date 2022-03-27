module.exports = {
	name: 'meme',
	alias: ['me'],
	args: true,
	adminOnly: true,
	GcOnly: true,
	usage: '[meme-id ]',
	description: 'Generate a meme.',
	info: 'Generate a meme.',
	cooldown: true,
	execute: async function (
		api: { sendMessage: (arg0: string, arg1: any) => void },
		message: { threadID: any },
		args: any[],
		config: any,
		utils: any
	) {
		var fetch = require('node-fetch');
		const response = await fetch('https://api.imgflip.com/get_memes').then((res: { json: () => any }) =>
			res.json()
		);

		function sendMeme(meme: { name: any; id: any; url: any; box_count: any; width: any; height: any }) {
			if (!meme) {
				api.sendMessage('No meme found.', message.threadID);
				return;
			}
			let x: any[] = [];
			if (meme.name) x.push(`Name: ${meme.name}`);
			if (meme.id) x.push(`ID: ${meme.id}`);
			if (meme.url) x.push(`URL: ${meme.url}`);
			if (meme.box_count) x.push(`Box Count: ${meme.box_count}`);
			if (meme.width) x.push(`Width: ${meme.width}`);
			if (meme.height) x.push(`Height: ${meme.height}`);
			api.sendMessage(x.join('\n'), message.threadID);
		}

		switch (args[0]) {
			case 'list':
			case 'l':
				api.sendMessage(
					response.data.memes.map((meme: { name: any; id: any }) => `${meme.name} - ${meme.id}`).join('\n'),
					message.threadID
				);
				break;

			case 'search':
			case 's':
				if (isNaN(args[1])) {
					// search by name
					let meme = response.data.memes.find((meme: { name: string }) =>
						meme.name.toLowerCase().includes(args[1].toLowerCase())
					);
					sendMeme(meme);
				} else {
					sendMeme(response.data.memes.find((meme: { id: any }) => meme.id == args[1]));
				}

				break;

			default:
				api.sendMessage(`${args[0]} is not a valid meme.`, message.threadID);
				break;
		}
	},
};
