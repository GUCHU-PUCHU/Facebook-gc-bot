var fse = require('fs-extra');
var moment = require('moment');
var path = require('path');
var config = require('../data/config');
module.exports = {
	name: 'snipe',
	alias: ['snipe', 'snp'],
	args: false,
	adminOnly: true,
	GcOnly: true,
	description:
		'Snipe the last message sent in your thread or last message sent byt a person!\n' +
		`Example: \n` +
		`\t - ${config.prefix}snipe\n` +
		`\t - ${config.prefix}snipe 100017885543327\n` +
		`\t - ${config.prefix}snipe @user`,
	info: 'Snipe a message',
	usage: '[id?]',
	cooldown: true,
	execute: function (api: any, message: any, args: any[], utils: any) {
		var log = fse.readJsonSync(path.join(__dirname, '../data/log.json'));
		var uInfo = fse.readJsonSync(path.join(__dirname, '../data/uInfo.json'));
		var query = args.join(' ');
		var msg_id = message.messageID;
		var sender_id = message.senderID;
		var thread_id = message.threadID;

		if (!log[thread_id] || !log[thread_id][sender_id])
			return api.sendMessage('No sniped messages found in this thread!', thread_id);
		if (!query) {
			var l = log[thread_id];
			var author = l._author;
			var cnt = l._lstmsg;
			var tm = moment(parseInt(l._timestamp)).format('MMM Do YY');
			utils.sendMessage(cnt + '\n\t- ' + author + '\n\t- ' + tm, api, thread_id, {
				limit: 1000,
				delay: 2,
			});
			return;
		}

		if (query.startsWith('@')) {
			query = query.substring(1);
			// check if one of the id's name in uInfo matches the query
			var id = Object.keys(uInfo[thread_id]).find((id) => {
				// console.log(uInfo[thread_id][id].name);
				if (uInfo[thread_id][id].name.toLowerCase() === query.toLowerCase()) {
					return uInfo[thread_id][id];
				}
			});

			if (!id)
				return api.sendMessage(
					'No user found with that name!\n' +
						"His bot's user profile is probably has not been generated yet!\n" +
						`use ${config.prefix}info @user to initialize.`,
					thread_id
				);

			try {
				var l = log[thread_id][id];
				var author = l.author;
				var cnt = l.lstmsg;
				var tm = moment(parseInt(l.timestamp)).format('MMM Do YY');
				utils.sendMessage(cnt + '\n\t- ' + author + '\n\t- ' + tm, api, thread_id, {
					limit: 1000,
					delay: 2,
				});
			} catch (error) {
				// console.log(error);
				utils.failReact(api, msg_id);
				return api.sendMessage('No sniped messages found in this thread!', thread_id);
			}
		}
	},
};
