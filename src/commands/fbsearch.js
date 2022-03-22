var log = require('npmlog');

module.exports = {
	name: 'fbsearch',
	description: 'Search in Facebook!',
	usage: '< user | group | page | event > [query]',
	adminOnly: false,
	args: false,
    hidden: false,
    cooldown: true,
	execute(api, message, args) {
		const query = args.slice(1).join(' ');
		const dataP = [];
		const dataC = [];
		api.getUserID(query, (err, data) => {
			if (err) return log.error('FB Search', err);
			
			switch (args[0]) {
				case 'user':
				case 'group':
				case 'page':
				case 'event':
					for (let i = 0; i < data.length; i++) {
						if (data[i].type === args[0]) {
							dataC.push(data[i].name);
							dataP.push(`Name: ${data[i].name}`);
							dataP.push(`ID: ${data[i].userID}`);
							if (data[i].isVerified !== undefined) dataP.push(`Verified?: ${data[i].isVerified}`);
							if (data[i].type === 'event') dataP.push(`Profile URL:  https://www.facebook.com${data[i].profileUrl}`);
							else dataP.push(`Profile URL:  ${data[i].profileUrl}`);
							dataP.push('====');
						}
					}
					
					break;
			
				default:
					for (let i = 0; i < data.length; i++) {
						dataC.push(data[i].name);
						dataP.push(`Name: ${data[i].name}`);
						dataP.push(`ID: ${data[i].userID}`);
						if (data[i].isVerified !== undefined) dataP.push(`Verified?: ${data[i].isVerified}`);
						if (data[i].type === 'event') dataP.push(`Profile URL:  https://www.facebook.com${data[i].profileUrl}`);
						else dataP.push(`Profile URL:  ${data[i].profileUrl}`);
						dataP.push('====');
					}

					break;
			}
			api.sendMessage(`${dataC.length} result of ${args[0]} found! \n\n${dataP.join('\n')}`, message.threadID);

		});
	},
};