var moment = require('moment');
var utils = require('../utils');
var cache = [];

module.exports = {
	name: 'att',
	description: 'Records attendance or list of things',
	usage: '< start [limit?] [details?] | stop | status | add [entry] | clear | remove [arr[?]] >',
	adminOnly: false,
	args: true,
	hidden: false,
	cooldown: false,
	async execute(api, message, args) {
		var txt = [];
		if (!cache[message.threadID]) {
			cache[message.threadID] = {
				isRecording: false,
				messageId: '',
				date: '',
				limit: 0,
				details: '',
				list: [],
			};
			console.log('New cache created for thread ' + message.threadID);
		}

		switch (args[0]) {
			case 'start':
				if (cache[message.threadID].isRecording) {
					api.sendMessage('Already recording!', message.threadID);
					return utils.noticeReact(api, message.messageID);
				} else {
					cache[message.threadID].isRecording = true;
					cache[message.threadID].messageId = message.messageID;
					utils.waitReact(api, message.messageID);
					if (isNaN(args[1])) {
						cache[message.threadID].details = args
							.slice(1)
							.join(' ');
					} else {
						cache[message.threadID].limit = parseInt(args[1]);
						cache[message.threadID].details = args
							.slice(2)
							.join(' ');
					}
					cache[message.threadID].date = moment().format(
						'MMMM Do YYYY, h:mm a'
					);
					txt.push(
						'Recording started at ' + cache[message.threadID].date
					);
					if (cache[message.threadID].details)
						txt.push('Details: ' + cache[message.threadID].details);
					if (cache[message.threadID].limit)
						txt.push('Limit: ' + cache[message.threadID].limit);
					api.sendMessage(txt.join('\n'), message.threadID);
				}
				break;

			case 'stop':
				if (!cache[message.threadID].isRecording) {
					api.sendMessage('Already stopped!', message.threadID);
					return utils.noticeReact(api, message.messageID);
				} else {
					cache[message.threadID].isRecording = false;
					utils.successReact(api, cache[message.threadID].messageId);
					txt.push(cache[message.threadID].date);

					if (cache[message.threadID].details)
						txt.push('Details: ' + cache[message.threadID].details);
					txt.push(
						utils.numberBulletGiver(cache[message.threadID].list)
					);
					api.sendMessage(txt.join('\n'), message.threadID);
					cache[message.threadID].list = [];
				}
				break;

			case 'status':
				if (!cache[message.threadID].isRecording) {
					api.sendMessage('Not recording!', message.threadID);
					return utils.noticeReact(api, message.messageID);
				} else {
					if (cache[message.threadID].list.length === 0)
						return api.sendMessage(
							'No entries recorded!',
							message.threadID
						);
					txt.push(cache[message.threadID].date);
					if (cache[message.threadID].details)
						txt.push('Details: ' + cache[message.threadID].details);
					txt.push(
						utils.numberBulletGiver(cache[message.threadID].list)
					);
					api.sendMessage(txt.join('\n'), message.threadID);
				}
				break;

			case 'add':
				// check if list is full
				if (
					cache[message.threadID].limit > 0 &&
					cache[message.threadID].list.length >=
						cache[message.threadID].limit
				) {
					api.sendMessage('List is full!', message.threadID);
					txt.push(cache[message.threadID].date);
					if (cache[message.threadID].details)
						txt.push(cache[message.threadID].details);
					txt.push(
						utils.numberBulletGiver(cache[message.threadID].list)
					);
					api.sendMessage(txt.join('\n'), message.threadID);
					return utils.successReact(
						api,
						cache[message.threadID].messageId
					);
				}

				if (!cache[message.threadID].isRecording) {
					api.sendMessage('Not recording!', message.threadID);
					return utils.noticeReact(api, message.messageID);
				} else {
					cache[message.threadID].list.push(args.slice(1).join(' '));
					utils.listedReact(api, message.messageID);
				}
				break;

			case 'clear':
				if (!cache[message.threadID].isRecording) {
					api.sendMessage('Not recording!', message.threadID);
					return utils.noticeReact(api, message.messageID);
				} else {
					cache[message.threadID].list = [];
					api.sendMessage('Cleared all entries!', message.threadID);
				}
				break;

			case 'remove':
				if (!cache[message.threadID].isRecording) {
					api.sendMessage('Not recording!', message.threadID);
					return utils.noticeReact(api, message.messageID);
				} else {
					if (args[1] === 'all') {
						cache[message.threadID].list = [];
						api.sendMessage(
							'Cleared all entries!',
							message.threadID
						);
					} else {
						var arr = args.slice(1);
						var removed = [];
						// remove an entry from the list based on the number given in the args
						for (var i = 0; i < arr.length; i++) {
							var index = parseInt(arr[i]) - 1;
							if (index < cache[message.threadID].list.length) {
								removed.push(
									cache[message.threadID].list[index]
								);
								cache[message.threadID].list.splice(index, 1);
							}
						}
						if (!removed.length)
							return utils.noticeReact(api, message.messageID);
						api.sendMessage(
							'Removed ' + removed.join(', ') + ' from the list!',
							message.threadID
						);
					}
				}
				break;

			default:
				api.sendMessage('Invalid command!', message.threadID);
				utils.noticeReact(api, message.messageID);
				break;
		}
	},
};
