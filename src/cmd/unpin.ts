var fse = require('fs-extra');
var path = require('path');
var config = require('../data/config');
module.exports = {
	name: 'unpin',
	alias: ['unpin', 'unp'],
	args: false,
	adminOnly: true,
	GcOnly: true,
	description:
		'Unpin the message that was pinned.\n' +
		`Example: \n` +
		`\t - ${config.prefix}unpin\n` +
		`\t - ${config.prefix}unpin Fruits`,
	info: 'Unpin a message',
	usage: '[subject]',
	cooldown: true,
	execute: function (
		api: { sendMessage: (arg0: string, arg1: any) => void },
		message: { threadID: any },
		args: any[]
	) {
		var pins = fse.readJsonSync(path.join(__dirname, '../data/pins.json'));
		var thread_id = message.threadID;
		var subject = args[0];

		if (pins[thread_id].length === 0) return api.sendMessage('No pins in this thread.', message.threadID);
		if (!pins[thread_id][subject]) return api.sendMessage('No pins for that subject.', message.threadID);

		pins[thread_id][subject] = undefined;
		delete pins[thread_id][subject];
		fse.writeJsonSync(path.join(__dirname, '../data/pins.json'), pins, { spaces: 2 });
		api.sendMessage('Pin removed.', message.threadID);
	},
};
