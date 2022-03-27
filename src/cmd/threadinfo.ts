module.exports = {
	name: 'threadinfo',
	alias: ['ti'],
	args: false,
	adminOnly: false,
	GcOnly: true,
	usage: '',
	description: 'Get info about the current thread.',
	info: 'Get info about the current thread.',
	cooldown: false,
	execute: async function (
		api: {
			getThreadInfo: (arg0: any, arg1: (err: any, info: any) => void) => void;
			sendMessage: (arg0: string, arg1: any) => void;
		},
		message: { threadID: any },
		args: any,
		config: any,
		utils: any
	) {
		let x: any[] = [];
		api.getThreadInfo(
			message.threadID,
			(
				err: any,
				info: {
					name: any;
					threadID: number;
					participantIDs: any[];
					messageCount: number;
					adminIDs: any[];
					emoji: any;
					imageSrc: any;
				}
			) => {
				if (err) return console.error(err);
				if (info.name) x.push(`Name: ${info.name}`);
				x.push(
					'Thread ID: ' +
						info.threadID +
						'\n' +
						'Participants: ' +
						info.participantIDs.length +
						'\n' +
						'Message Count: ' +
						info.messageCount +
						'\n' +
						'No. of Admins: ' +
						info.adminIDs.length +
						'\n'
				);
				if (info.emoji != null) x.push('Emoji: ' + info.emoji);
				if (info.imageSrc != null) x.push('Image: ' + info.imageSrc);
				api.sendMessage(x.join('\n'), message.threadID);
			}
		);
	},
};
