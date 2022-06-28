"use strict";
var path = require('path');
var moment = require('moment');
var utils = require('../utils');
var fse = require('fs-extra');
var config = require('../data/config');
module.exports = {
    name: 'pin',
    alias: ['pin', 'pn'],
    args: true,
    adminOnly: true,
    GcOnly: true,
    usage: '[ list | subject | [subject] [content]] ',
    description: 'This command is used to pin a content\n' +
        'How do I use this command?\n' +
        `To pin a content, you need to use the following format: \n` +
        `You must use a "-" as a seperator between content and subject.\n` +
        `${config.prefix}pin [subject] - [content] \n` +
        `Example: \n` +
        `${config.prefix}pin Fruits - Apple Mango and Bananas! \n` +
        ` - subject: The subject of the content. \n` +
        ` - content: The content that you want to pin. \n\n` +
        `To list all the pins, you can use the following format: \n` +
        `${config.prefix}pin list \n\n` +
        `To view the content of a pin: \n` +
        `${config.prefix}pin [subject]\n\n` +
        `To remove a pin: \n` +
        `${config.prefix}unpin [subject]\n\n`,
    info: 'pin a message',
    cooldown: true,
    execute: function (api, message, args) {
        var pins = fse.readJsonSync(path.join(__dirname, '../data/pins.json'));
        var thread_id = message.threadID;
        var author = message.senderID;
        if (args[0] === 'list') {
            if (!pins[thread_id])
                return api.sendMessage('No pins in this thread.', thread_id);
            var list = Object.keys(pins[thread_id]).map((key, index) => {
                var time = moment(parseInt(pins[thread_id][key].timestamp)).format('MMMM Do YYYY, h:mm:ss a');
                return `${index + 1}. ${key} \n\t- ${time}\n`;
            });
            utils.sendMessage(list.join('\n'), api, thread_id, { limit: 2000, delay: 2 });
            return;
        }
        if (!isNaN(parseInt(args[0]))) {
            if (!pins[thread_id])
                return api.sendMessage('No pins in this thread.', thread_id);
            var subs = Object.keys(pins[thread_id]).map((index) => {
                return index;
            });
            if (parseInt(args[0]) > pins[thread_id].length)
                return api.sendMessage('Index out of range.', thread_id);
            var index = subs[parseInt(args[0]) - 1];
            var tm = moment(parseInt(pins[thread_id][index].timestamp)).format('MMMM Do YYYY, h:mm:ss a');
            var cnt = pins[thread_id][index].content;
            var msgs = `${cnt} \n\t- ${tm}\n`;
            utils.sendMessage(msgs, api, thread_id, { limit: 2000, delay: 2 });
            return;
        }
        try {
            var subject = args.join(' ').split('-')[0].trim();
            var content = args
                .join(' ')
                .slice(subject.length + 2)
                .trim();
        }
        catch (error) {
            utils.failReact(api, message.messageID);
            return;
        }
        if (pins[thread_id] && pins[thread_id][subject]) {
            var msg = pins[thread_id][subject];
            var time = moment(parseInt(pins[thread_id][subject].timestamp)).format('MMMM Do YYYY, h:mm:ss a');
            var sub = subject;
            var cnt = msg.content;
            utils.sendMessage('Subject: ' + sub + '\nContents: \n\t' + cnt + ' \n\n\t- ' + time, api, thread_id, {
                limit: 100,
            });
            return;
        }
        if (!subject)
            return api.sendMessage('Please specify a subject.', thread_id);
        if (!content)
            return api.sendMessage('Please specify a content.', thread_id);
        if (pins[thread_id] && pins[thread_id][subject])
            return api.sendMessage('Pin already exists.', thread_id);
        if (!pins[thread_id])
            pins[thread_id] = {};
        pins[thread_id][subject] = {
            content: content,
            author: author,
            timestamp: Date.now(),
        };
        fse.writeJsonSync(path.join(__dirname, '../data/pins.json'), pins, { spaces: 4 });
        api.setMessageReaction('📌', message.messageID);
    },
};
