"use strict";
var fse = require('fs-extra');
var path = require('path');
var config = require('../data/config');
module.exports = {
    name: 'unpin',
    alias: ['unpin', 'unp'],
    args: false,
    adminOnly: true,
    GcOnly: true,
    description: 'Unpin the message that was pinned.\n' +
        `Example: \n` +
        `\t - ${config.prefix}unpin\n` +
        `\t - ${config.prefix}unpin 1`,
    info: 'Unpin a message',
    usage: '[index]',
    cooldown: true,
    execute: function (api, message, args, utils) {
        var pins = fse.readJsonSync(path.join(__dirname, '../data/pins.json'));
        var thread_id = message.threadID;
        var index = args[0];
        if (pins[thread_id].length === 0)
            return api.sendMessage('No pins in this thread.', message.threadID);
        if (isNaN(index))
            return api.sendMessage('Must be an index from the list.', thread_id);
        if (parseInt(index) > pins[thread_id].length)
            return api.sendMessage('Index out of range.', thread_id);
        let subs = Object.keys(pins[thread_id]).map((subs) => {
            return subs;
        });
        pins[thread_id][subs[index - 1]] = undefined;
        delete pins[thread_id][subs[index - 1]];
        fse.writeJsonSync(path.join(__dirname, '../data/pins.json'), pins, { spaces: 4 });
        utils.successReact(api, message.messageID);
    },
};
