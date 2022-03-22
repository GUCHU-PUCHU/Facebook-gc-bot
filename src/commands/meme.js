var log = require('npmlog')
var fse = require('fs-extra')
var utils = require('../utils')
var config = require('../config.json');

const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))
require('dotenv').config()

module.exports = {
	name: 'meme',
	description: 'Generate a meme. args are seperated by a semi-colon.',
	usage: '< list | search [id] | id [args[i]]>',
	adminOnly: false,
	args: false,
    hidden: false,
    cooldown: true,
	async execute(api, message, args) {
		var i;
		log.info('test', 'args', args)
		
		const response = await fetch(`https://api.imgflip.com/get_memes`)
			.then((res) => res.json());
		
		function sendMeme(meme) {
			let x = [];
			if (meme.name) x.push('Name: ' + meme.name);
			if (meme.id) x.push('ID: ' + meme.id);
			if (meme.box_count)x.push('Box Count: ' + meme.box_count);
			if (meme.url) x.push('URL: ' + meme.url);
			return api.sendMessage(x.join('\n'), message.threadID);
		}

		switch (args[0]) {
			case 'list':
			case 'l':
				api.sendMessage(
					'This bot uses the imgflip API.\n' +
					'You can view the list in this link:\n' +
					'https://imgflip.com/popular_meme_ids',
				message.threadID);
				break;

			case 'search':
			case 's':
				var query = args.slice(1).join(' ');
				if (isNaN(query)) {
					for (i = 0; i < response.data.memes.length; i++) {
						if (response.data.memes[i].name.toLowerCase().includes(query.toLowerCase())) {
							let meme = response.data.memes[i];
							sendMeme(meme);
							utils.successReact(api, message.messageID);
							return;
						}
					}
					api.sendMessage('No results found.', message.threadID);
					utils.errorReact(api, message.messageID);
				} else {
					for (i = 0; i < response.data.memes.length; i++) {
						if (response.data.memes[i].id == query) {
							let meme = response.data.memes[i];
							sendMeme(meme);
							utils.successReact(api, message.messageID);
							return;
						}
					}
					utils.errorReact(api, message.messageID);
					api.sendMessage('No results found.', message.threadID);
				}

				break;
					
			default:
				var text = args.slice(1).join(' ').split(';');
				if (isNaN(args[0])) {
					utils.noticeReact(api, message.messageID);

					return api.sendMessage(
						`Please enter a valid meme id.\n` +
						`For the list of memes, use the command \`${config.prefix}meme list\`\n` +
						`For searching memes, use the command \`${config.prefix}meme search [id]\`\n` +
						`For generating a meme \`${config.prefix}meme [id] [text1]; [text2];...\`\n` +
						`Please note that the every text must be seperated by a semi-colon.\n` +
						`Except the last text.`, 
						message.threadID);
				}

				for (i = 0; i < response.data.memes.length; i++) {
					if (response.data.memes[i].id == args[0]) {
						if (response.data.memes[i].box_count < text.length) {
							utils.noticeReact(api, message.messageID);
							api.sendMessage(
								`Your aguments "${text.join(', ')}" is too long.\n` +
								`Meme has only ${response.data.memes[i].box_count} boxes.`,
							message.threadID);
						}
					}
				}				
				var params = new URLSearchParams();
				params.append('template_id', args[0]);
				if (!config.Imgflip.user) {
					params.append('username', 'imgflip_hubot');
					params.append('password', 'imgflip_hubot');
				}
				params.append('username', config.Imgflip.user);
				params.append('password', config.Imgflip.pass);
				for (i = 0; i < text.length; i++) {
					params.append(`boxes[${i}][text]`, text[i]);
				}

				var meme = await fetch(`https://api.imgflip.com/caption_image`, {
					method: 'POST',
					body: params,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then((res) => res.json());

				if (!meme.success) {
					utils.noticeReact(api, message.messageID);
					api.sendMessage(`Something went wrong.\n${meme.error_message}`, message.threadID);
					return;
				}
				utils.waitReact(api, message.messageID);
				fetch(meme.data.url)
					.then((res) => res.body.pipe(fse.createWriteStream(`./src/data/image.jpg`)))
					.catch((err) => {
						console.log(err);
						utils.noticeReact(api, message.messageID);
						api.sendMessage(`Something went wrong.\n${err}`, message.threadID);
					});

				await utils.sleep(2000);
				utils.successReact(api, message.messageID);
				return api.sendMessage({
					body: ` `,
					attachment: fse.createReadStream(`./src/data/image.jpg`)
				}, message.threadID);
		}
		utils.successReact(api, message.messageID);
	},
}
// lazy.. lazy.. and messy..