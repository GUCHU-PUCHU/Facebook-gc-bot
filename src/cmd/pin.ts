var path = require('path');
var fse = require('fs-extra');
var moment = require('moment');
var utils = require('../utils');
var config = require('../data/config');
module.exports = {
	name: 'pin',
	alias: ['pin', 'pn'],
	args: true,
	adminOnly: true,
	GcOnly: true,
	usage: '[list | subject | [subject] [content]] ',
	description:
		'This command is used to pin a content\n' +
		'How do I use this command?\n' +
		`To pin a content, you need to use the following format: \n` +
		`${config.prefix}pin [subject] [content] \n` +
		`Example: \n` +
		`${config.prefix}pin Fruits Apple Mango and Bananas! \n` +
		` - subject: The subject of the content. \n` +
		` - content: The content that you want to pin. \n\n` +
		`To list all the pins, you can use the following format: \n` +
		`${config.prefix}pin list \n\n` +
		`To view the content of a pin: \n` +
		`${config.prefix}pin [subject]`,
	info: 'pin a message',
	cooldown: 5,
	execute(
		api: { sendMessage: (arg0: string, arg1: any) => void },
		message: { threadID: any; senderID: any },
		args: any[]
	) {
		var pins = fse.readJsonSync(path.join(__dirname, '../data/pins.json'));
		var thread_id = message.threadID;
		var author = message.senderID;

		var subject = args[0];
		var content = args.slice(1).join(' ');

		// if args is equals to list then list all pins
		if (subject === 'list') {
			if (!pins[thread_id]) return api.sendMessage('No pins in this thread.', thread_id);
			var list = Object.keys(pins[thread_id]).map((key) => {
				var time = moment(parseInt(pins[thread_id][key].timestamp)).format('MMMM Do YYYY, h:mm:ss a');
				return `${key} \n\t- ${time}\n`;
			});
			utils.sendMessage(list.join('\n'), api, thread_id, { limit: 100 });
			return;
		}

		// if args is equals to one of the pins then display the pin
		if (pins[thread_id] && pins[thread_id][subject]) {
			var msg = pins[thread_id][subject];
			var time = moment(parseInt(pins[thread_id][subject].timestamp)).format('MMMM Do YYYY, h:mm:ss a');
			var cnt = msg.content;
			utils.sendMessage(cnt + ' \n\t- ' + time, api, thread_id, { limit: 100 });
			return;
		}

		if (!subject) return api.sendMessage('Please specify a subject.', thread_id);
		if (!content) return api.sendMessage('Please specify a content.', thread_id);

		// if pin already exists return
		if (pins[thread_id] && pins[thread_id][subject]) return api.sendMessage('Pin already exists.', thread_id);

		// if pin doesn't exist add it
		if (!pins[thread_id]) pins[thread_id] = {};
		pins[thread_id][subject] = {
			content: content,
			author: author,
			timestamp: Date.now(),
		};

		// save pins
		fse.writeJsonSync(path.join(__dirname, '../data/pins.json'), pins, { spaces: 4 });

		// send message
		api.sendMessage('Pin added.', thread_id);
	},
};
