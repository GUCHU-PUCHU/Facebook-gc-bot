const moment = require('moment');
const fs = require('fs-extra');
const log = require('npmlog');
let isRecording = false;
let date;
let limit;
var list = [];
module.exports = {
    name: 'att',
    description: 'Takes or records attendance',
    usage: '< start [limit?] | stop | status | add [entry] >',
    adminOnly: false,
    args: true,
    async execute(api, message, args) {
        // log.info('test', temp.isRecording);

        if (args[0] === 'start') {
            if (isRecording) {
                api.sendMessage('Already recording!', message.threadID);
            } else {
                isRecording = true;

                if (args[1]) {
                    limit = args[1];
                    if (isNaN(limit)) {
                        api.sendMessage('Invalid limit!', message.threadID);
                        isRecording = false;
                        return;
                    }
                    if (limit == undefined) {
                        api.sendMessage('No limit set! Recording until you stop', message.threadID);
                        limit = parseInt(Infinity);
                    }
                }
                date = moment().format('MMMM Do YYYY, h:mm:ss a');
                api.sendMessage('Recording started at ' + date, message.threadID);
            }
        }

        if (args[0] === 'stop') {

            if (!isRecording) {
                api.sendMessage('Already stopped!', message.threadID);
            } else {
                isRecording = false;
                api.sendMessage('Recording stopped!\n', message.threadID);
                api.sendMessage(`${date}\n` + list.join('\n'), message.threadID);
                list = [];
            }
        }

        if (args[0] === 'status') {
            if (!isRecording) {
                return api.sendMessage('Recording not active!', message.threadID);
            } else {
                if (list.length == 0) return api.sendMessage('No entries recorded yet!', message.threadID);
                api.sendMessage(`${date}\n` + list.join('\n'), message.threadID);
                api.sendMessage(`Recorded ${list.length} entries!`, message.threadID);
            }
        }

        if (args[0] === 'add') {

            if (!isRecording) {
                api.sendMessage('Recording not active!', message.threadID);
            } else {

                if (!args[1]) return api.sendMessage('Entry is empty! Please try again.', message.threadID);

                if (list.length == limit) {
                    api.sendMessage('List is full! Stopping...', message.threadID);
                    api.sendMessage(`${date}\n` + list.join('\n'), message.threadID);
                    list = [];
                    isRecording = false;
                } else {
                    list.push(`${list.length + 1}. ${args.slice(1).join(' ')}`);
                    api.setMessageReaction(' ', message.messageID, (err) => {

                        if (err) return log.error('test', err);
                        api.setMessageReaction('✅', message.messageID);
                    });
                }
            }
        } // Yes, I know this is a mess. I'm sorry. But it works.
    },
}