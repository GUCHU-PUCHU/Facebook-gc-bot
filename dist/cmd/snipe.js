"use strict";
var fse = require('fs-extra');
var moment = require('moment');
var path = require('path');
var config = require('../data/config');
module.exports = {
    name: 'snipe',
    alias: ['snipe', 'snp'],
    args: false,
    adminOnly: true,
    GcOnly: true,
    description: 'Snipe the last message sent in your thread or last message sent byt a person!\n' +
        `Example: \n` +
        `\t - ${config.prefix}snipe\n` +
        `\t - ${config.prefix}snipe 100017885543327`,
    info: 'Snipe a message',
    usage: '[id?]',
    cooldown: true,
    execute: function (api, message, args) {
        var log = fse.readJsonSync(path.join(__dirname, '../data/log.json'));
        var iD = args[0];
        var thread_id = message.threadID;
        if (!log[thread_id])
            return api.sendMessage('No messages in this thread.', thread_id);
        if (!args[0]) {
            var msg = log[thread_id];
            var author = msg._author;
            var content = msg._lstmsg;
            var time = moment(parseInt(msg._timestamp)).format('MMMM Do YYYY, h:mm:ss a');
            return api.sendMessage(`**Message Sniped**\nAuthor: ${author}\nTime: ${time}\n\t- ${content}`, thread_id);
        }
        if (!log[thread_id][iD])
            return api.sendMessage('No message with that ID.', thread_id);
        var msg = log[thread_id][iD];
        var time = moment(parseInt(msg.timestamp)).format('MMMM Do YYYY, h:mm:ss a');
        var content = msg.lstmsg;
        api.sendMessage(content + ' \n\t- ' + time, thread_id);
    },
};
