"use strict";
var config = require('../data/config');
module.exports = async (api, message) => {
    let msg = message.body;
    if (config.response.length > 0) {
        if (msg.startsWith(config.prefix))
            return;
        if (msg.toLowerCase().includes('@' + config.bot_name.toLowerCase())) {
            api.sendMessage(config.response, message.threadID);
        }
    }
};
