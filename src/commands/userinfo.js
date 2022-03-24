var log = require('npmlog');
module.exports = {
	name: 'userinfo',
	description: 'get info about a facebook user',
	usage: '[user id]',
	adminOnly: false,
	args: false,
	hidden: false,
	cooldown: true,
	execute(api, message, args) {
		let query = args[0];
		let data = [];
		api.getUserInfo(query, (err, user) => {
			if (err) return log.error('User Info', err);
			log.info('User Info', user);
			for (var x in user) {
				if (user.hasOwnProperty(x)) {
					data.push(`Name: ${user[x].name}`);
					data.push(`Vanity: ${user[x].vanity}`);
					data.push(`Profile Link: ${user[x].profileUrl}`);
					api.sendMessage(data.join('\n'), message.threadID);
				}
			}
		});
	},
};
