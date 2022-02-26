const moment = require('moment');
const fs = require('fs-extra');
const log = require('npmlog');
let isRecording = false;
let date;
var list = [];
module.exports = {
    name: 'att',
    description: 'Takes or records attendance',
    usage: '< start | stop | add [entry] >',
    adminOnly: false,
    args: true,
    async execute(api, message, args) {
        // log.info('test', temp.isRecording);
        if (args[0] === 'start') {

            if (isRecording) {
                api.sendMessage('Already recording!', message.threadID);
            } else {
                isRecording = true;
                date = moment().format('MMMM Do YYYY, h:mm:ss a');
                api.sendMessage('Recording started!\n' + date, message.threadID);
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

        if (args[0] === 'add') {

            if (!isRecording) {
                api.sendMessage('Recording not active!', message.threadID);
            } else {

                if (!args[1]) return api.sendMessage('Entry is empty! Please try again.', message.threadID);
        
                if (list.length >= 55) {
                    api.sendMessage('List is full! Stopping...', message.threadID);
                    api.sendMessage(`${date}\n` + list.join('\n'), message.threadID);
                    list = [];
                } else {
                    list.push(`${list.length + 1}. ${args.slice(1).join(' ')}`);
                    api.setMessageReaction(' ', message.messageID, (err) => {

                        if (err) return log.error('test', err);
                        api.setMessageReaction('✅', message.messageID);
                    });
                }
            }
        }
    },
}