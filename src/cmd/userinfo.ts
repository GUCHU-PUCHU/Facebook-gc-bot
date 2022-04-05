var _fetch = require('node-fetch');
module.exports = {
	name: 'userinfo',
	alias: ['userinfo', 'user', 'lookup', 'profile', 'info', 'whois'],
	args: true,
	adminOnly: true,
	GcOnly: true,
	usage: '[ userid | @user ]',
	description: 'Get user info.',
	info: 'Get user info.',
	cooldown: true,
	execute: async function (api: any, message: any, args: any, utils: any) {
		let mentions = message.mentions;
		let thread_id = message.threadID;
		let query = args[0];
		let id: any;

		// console.log(Object.keys(mentions)[0]);

		if (isNaN(query) || query.startsWith('@')) {
			id = Object.keys(mentions)[0];
		} else {
			id = query;
		}

		api.getUserInfo(id, async (err: string, res: any) => {
			if (err) {
				utils.failReact(api, message.messageID);
				console.log(err);
				return api.sendMessage('Error! ' + err, thread_id);
			}
			let msg = {
				body:
					`*${res[id].name}*\n` +
					`ID: ${id}\n` +
					`First name: ${res[id].firstName}\n` +
					`Profile Url: ${res[id].profileUrl}\n`,
			};
			api.sendMessage(msg, thread_id);
		});
	},
};
