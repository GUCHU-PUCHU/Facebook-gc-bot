const utils = require("../utils");
const log = require("npmlog");

module.exports = {
	name: 'ping',
	description: 'test!',
    adminOnly: true,
	execute(api, message) {
		let x = [];
		let latency = Date.now() - message.timestamp;
		api.sendMessage(`Pong! \n >> Latency is ${latency}.ms <<\n\n`, message.threadID);
		api.getUserInfo(message.senderID, (err, user) => {
			if (err) return log.error(err);
			for (var prop in user) {
				x.push(user[prop].name);
			}
			log.info(`Ping`, x.join(" "));
		});
	},
};