const log = require('npmlog');

module.exports = {
    name: 'threadinfo',
    description: 'Get info about thread',
    adminOnly: true,
    args: false,
    async execute(api, message) {
        api.getThreadInfo(message.threadID, (err, info) => {
            if (err) log.error('Thread Info', err);

            let data = [];
            data.push(`Thread ID: ${info.threadID}`);

            if (info.name != null) data.push(`Name: ${info.name}`);
            data.push(`Participants: ${info.participantIDs.length}`);
            data.push(`messageCount: ${info.messageCount}`);

            if (info.emoji != null) data.push(`Emoji: ${info.emoji}`);
            data.push(`No. of Admins: ${info.adminIDs.length}`);

            for (let i = 0; i < info.adminIDs.length; i++) {
                for (const key in info.adminIDs[i]) {
                    if (info.adminIDs[i].hasOwnProperty(key)) {
                        api.getUserInfo(info.adminIDs[i][key], (err, user) => {
                            if (err) return log.error('Thread Info', err);
                            for (var x in user) {
                                if (user.hasOwnProperty(x)) {
                                    api.sendMessage(`Admin: ${user[x].name}`, message.threadID);
                                }
                            }
                        });
                    }
                }
            }

            api.sendMessage(data.join('\n'), message.threadID);
        });
    },
};

// Ah fuck it, I'm going to do this in the next version.
// My acumulated knowledge of javascript is not enough to make pretty and efficient code.
// send me an angel pls.