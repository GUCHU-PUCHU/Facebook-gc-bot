const moment = require('moment');
var utils = require("../utils");
let isRecording = false;
let date;
let limit;
let details = '';
var list = [];
module.exports = {
    name: 'att',
    description: 'Records attendance or list of things',
    usage: '< start [limit?] [details?] | stop | status | add [entry] | clear | remove [arr[?]] >',
    adminOnly: false,
    args: true,
    async execute(api, message, args) {
        let txt = [];
        switch (args[0]) {
            case 'start':
                if (isRecording) {
                    api.sendMessage('Already recording!', message.threadID);
                    return utils.noticeReact(api, message.messageID);
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
                }
                break;

            case 'stop':
                if (!isRecording) {
                    api.sendMessage('Already stopped!', message.threadID);
                    return utils.noticeReact(api, message.messageID);
                } else {
                    isRecording = false;
                    txt.push('Recording stopped at ' + date);

                    if (details) txt.push(details);
                    txt.push(utils.numberBulletGiver(list));
                    api.sendMessage(txt.join('\n'), message.threadID);
                    list = [];
                    return;
                }
                break;

            case 'status':
                if (!isRecording) {
                    api.sendMessage('Not recording!', message.threadID);
                    return utils.noticeReact(api, message.messageID);
                } else {
                    if (list.length === 0) return api.sendMessage('No entries recorded!', message.threadID);
                    txt.push('Recording started at ' + date);

                    if (details) txt.push('Details: ' + details);

                    if (limit) txt.push('Limit": ' + limit);
                    txt.push(utils.numberBulletGiver(list));
                }
                break;

            case 'add':
                if (!isRecording) {
                    api.sendMessage('Not recording!', message.threadID);
                    return utils.noticeReact(api, message.messageID);
                } else {
                    if (list.length == limit) {
                        isRecording = false;
                        txt.push(`List is full! with ${limit} entries`);
                        txt.push('Recording stopped at ' + date);

                        if (details) txt.push(details);
                        txt.push(utils.numberBulletGiver(list));
                    } else {
                        list.push(`${args.slice(1).join(' ')}`);
                        utils.successReact(api, message.messageID);
                        return;
                    }
                }
                break;

            case 'remove':
                if (!isRecording) return api.sendMessage('Not recording!', message.threadID);

                if (list.length === 0) {
                    utils.noticeReact(api, message.messageID);
                    return api.sendMessage('No entries recorded!', message.threadID);
                }

                if (!args[1] || isNaN(args[1])) {
                    utils.noticeReact(api, message.messageID);
                    return api.sendMessage('Please enter a valid number[int?] from the list', message.threadID);
                }

                var x = list.splice(args[1] - 1, 1);
                txt.push(`Removed ${x} from the list`);
                txt.push(utils.numberBulletGiver(list));
                break;

            case 'clear':
                if (list.length === 0) {
                    utils.noticeReact(api, message.messageID);
                    return api.sendMessage('list is empty!', message.threadID);
                }
                list = [];
                txt.push('List cleared!');
                break;

            default:
                txt.push('Invalid parameters!');
                txt.push('Usage: ' + this.usage);
                utils.noticeReact(api, message.messageID);
                break;
        }

        if (txt) utils.splitMessage(txt.join('\n'), 1000).forEach(msg => {
            api.sendMessage(msg, message.threadID);
        });
    }
}