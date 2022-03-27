"use strict";
module.exports = {
    name: 'tst',
    alias: ['tst', 'test'],
    args: false,
    adminOnly: false,
    GcOnly: false,
    usage: '[command]',
    description: 'test',
    info: 'for testing purposes',
    hidden: true,
    cooldown: true,
    execute: function (api, message) {
        api.setMessageReaction('👍', message.messageID);
    },
};
