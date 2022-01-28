module.exports = {
	name: 'ping',
	description: 'test!',
    adminOnly: true,
	execute(api, message) {
		let latency = Date.now() - message.timestamp;
		api.sendMessage(`Pong! \n >> Latency is ${latency}.ms <<\n\n`, message.threadID);
	},
};