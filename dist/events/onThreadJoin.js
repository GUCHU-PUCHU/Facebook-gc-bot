"use strict";
var fse = require('fs-extra');
var path = require('path');
var config = require('../data/config');
module.exports = async (api, message) => {
    var gInfo = fse.readJsonSync(path.join(__dirname, '../data/gInfo.json'));
    if (!message)
        return;
    let thread_id = message.threadID;
    if (!gInfo[thread_id])
        return api.sendMessage(`Hello! Thanks for inviting me!\n To view my commands use "${config.prefix}help".\n` +
            `\n Check out my source code at: \nhttps://github.com/PedjPedj/Facebook-gc-bot/tree/main`, thread_id);
};
