const fs = require('fs-extra');

module.exports = {
	name: 'help',
	description: 'display commands!',
	adminOnly: false,
	async execute(api, message, args, cmdMap, __dirname) {

		// function that seperates a message to multiple messages if a specific charachter limit is reached.
		function splitMessage(message, charLimit) {
			if (message.length <= charLimit) return [message];

			const split = message.split(' ');
			const result = [];
			let tempMsg = '';

			for (let i = 0; i < split.length; i++) {
				if (tempMsg.length + split[i].length < charLimit) {
					tempMsg += `${split[i]} `;
				} else {
					result.push(tempMsg);
					tempMsg = '';
					i--;
				}
			}
			result.push(tempMsg);

			return result;
		}

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

			const messages = splitMessage(data.join('\n'), 1268);
			for (let i = 0; i < messages.length; i++) {
				api.sendMessage(messages[i], message.senderID);
			}
			// api.sendMessage(messages[0], message.threadID);
		});
	},
};