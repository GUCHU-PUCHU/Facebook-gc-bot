var log = require('npmlog');
module.exports = {
    name: 'test',
    description: 'test',
    usage: '< test >',
    args: false,
    adminOnly: true,
    hidden: true,
    execute(api, message, args, cmdMap, __dirname) {
        // let query = args.join(' ');
        let query = args[0];
        let data = [];
        if (!args.length) return;

        let regEx = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
        let result = regEx.test(query);
        if (result) {
            log.info('test', 'contains emoji');
            let emoji = [...`${query}`];
            console.log(emoji);

        } else {
            log.info('test', 'does not contain emoji');
            data.push(`does not contain emoji`);
        }
        api.sendMessage(data.join('\n'), message.threadID);

        
        // api.setMessageReaction('', message.messageID,(err) => {
        //     if (err) {
        //         log.error(err);
        //         return;
        //     }
        //     api.setMessageReaction(query, message.messageID);
        // });
    


        // 
        // api.getThreadInfo(message.ThreadID, (err, info) => {
        //     if (err) {
        //         log.error(err);
        //         return;
        //     }

        //     let randomId = info.participantIDs[Math.floor(Math.random() * info.participantIDs.length)];
        //     api.getUserInfo(randomId, (err, user) => {
        //         if (err) {
        //             log.error(err);
        //             return;
        //         }
        //         for (var x in user) {
        //             if (user.hasOwnProperty(x)) {
        //                 data.push(`Name: ${user[x].name}`);
        //                 data.push(`Vanity: ${user[x].vanity}`);
        //                 data.push(`Profile Link: ${user[x].profileUrl}`);
        //                 api.sendMessage(data.join("\n"), message.threadID);
        //             }
        //         }
        //     });
        // });
    },
};