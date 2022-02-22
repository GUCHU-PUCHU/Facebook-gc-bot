const fs = require('fs-extra');
module.exports = {
	name: 'help',
	description: 'display commands!',
	adminOnly: false,
	async execute(api, message, args, cmdMap, __dirname) {
		fs.readdir(__dirname + `/commands`, (err, files) => {
			if (err) console.error(err);

			const jsFiles = files.filter((file) => file.endsWith('.js'));
			const {
				prefix,
			} = require(__dirname + `/config.json`);

			if (jsFiles.length <= 0) {
				console.log('no commands found!');
				return;
			}

			let name = '';
			let desc = '';
			const data = [];

			data.push('Here are some commands:\n');

			jsFiles.forEach((file) => {
				const cmd = require(`./${file}`);
				name = cmd.name;
				desc = cmd.description;
				data.push(`Name: ${name}`);
				data.push(`Description:\n  ${desc}`);
				if (cmd.usage) data.push(`Usage:\n ${prefix}${name} ${cmd.usage}`);
				data.push('============================');
			});
			api.sendMessage(`I sent the commands in your DM! If you can't find it check your message request.`, message.threadID);
			api.sendMessage(data.join('\n'), message.senderID);
		});
	},
};