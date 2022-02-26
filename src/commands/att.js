const moment = require('moment');
let isRecording = false;
let date;
let limit;
let details = '';
var list = [];
exports.isRecording = isRecording;
module.exports = {
    name: 'att',
    description: 'Takes or records attendance',
    usage: '< start [limit?] [details?]| stop | status | add [entry] | clear | remove >',
    adminOnly: false,
    args: true,
    async execute(api, message, args) {
        let txt = [];

        function numberBulletGiver(arr) {
            let i = 0;
            for (let item of arr) {
                i++;
                txt.push(`${i}. ${item}`);
            }
        }

        if (args[0] === 'start') {

            if (isRecording) {
                return api.sendMessage('Already recording!', message.threadID);
            } else {
                isRecording = true;

                if (isNaN(args[1])) {
                    details = args.slice(1).join(' ');
                } else {
                    limit = parseInt(args[1]);
                    details = args.slice(2).join(' ');
                }

                date = moment().format('MMMM Do YYYY, h:mm a');
                txt.push('Recording started at ' + date);

                if (details) txt.push(details);
                api.sendMessage(txt.join('\n'), message.threadID);
                return;
            }
        }

        if (args[0] === 'stop') {

            if (!isRecording) {
                return api.sendMessage('Already stopped!', message.threadID);
            } else {
                isRecording = false;
                txt.push('Recording stopped at ' + date);

                if (details) txt.push(details);
                txt.push(numberBulletGiver(list));
                api.sendMessage(txt.join('\n'), message.threadID);
                list = [];
                return;
            }
        }

        if (args[0] === 'status') {

            if (!isRecording) {
                return api.sendMessage('Recording not active!', message.threadID);
            } else {

                if (list.length == 0) return api.sendMessage('No entries recorded yet!', message.threadID);
                txt.push('Recording started at ' + date);

                if (details) txt.push('Details: ' + details);

                if (limit) txt.push('Limit: ' + limit);
                txt.push('Entries: ' + list.length);
                const msg = numberBulletGiver(list);
                api.sendMessage(msg, message.threadID);
                api.sendMessage(txt.join('\n'), message.threadID);
                return;
            }
            
        }

        if (args[0] === 'add') {

            if (!isRecording) {
                return api.sendMessage('Recording not active!', message.threadID);
            } else {

                if (!args[1]) return api.sendMessage('Entry is empty! Please try again.', message.threadID);

                if (list.length == limit) {
                    api.sendMessage(`Custom limit[${limit}] reached! Stopping...`, message.threadID);
                    api.sendMessage(`${date} \n${details} \n` + list.join('\n'), message.threadID);
                    list = [];
                    isRecording = false;
                    return;
                } else {
                    list.push(`${args.slice(1).join(' ')}`);
                    api.setMessageReaction(' ', message.messageID, (err) => {

                        if (err) return log.error('Attendance', err);
                        api.setMessageReaction('✅', message.messageID);
                    });
                    return;
                }
            }
        }

        if (args[0] === 'clear') {
                
                if (!isRecording) {
                    return api.sendMessage('Recording not active!', message.threadID);
                } else {
    
                    if (list.length == 0) return api.sendMessage('No entries recorded yet!', message.threadID);
                    list = [];
                    api.sendMessage('Entries cleared!', message.threadID);
                    return;
                }
        }

        if (args[0] === 'remove') {

            if (!isRecording) {
                return api.sendMessage('Recording not active!', message.threadID);
            } else {

                if (!args[1]) return api.sendMessage('Entry is empty! Please try again.', message.threadID);

                if (list.length == 0) return api.sendMessage('No entries recorded yet!', message.threadID);
                list.splice(args[1] - 1, 1);
                api.sendMessage('Entry removed!', message.threadID);
                const msg = numberBulletGiver(list);
                api.sendMessage(msg, message.threadID);
                return;
            }
        }
        
        else {
            api.sendMessage('Invalid parameter!', message.threadID);
            api.setMessageReaction('', message.messageID, (err) => {
                if (err) return log.error('Attendance', err);
                api.setMessageReaction('❌', message.messageID);
            });
            return;
        }
        // Yes, I know this is a mess. I'm sorry. But it works.
    },
}