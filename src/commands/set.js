const config = require('../config.json');
const utils = require('../utils');
const fs = require('fs');
const log = require('npmlog');

module.exports = {
    name: 'set',
    description: 'Set bot\'s config',
    usage: '< prefix | botname | response | threadID | apiKey | gcLock > [value]',
    adminOnly: true,
    args: true,
    async execute(api, message, args, cmdMap, __dirname,) {

        let key = args[0];
        let value = args.slice(1).join(' ');
        utils.lookReact(api, message.threadID);

        if (key === 'prefix') {
            config.prefix = value;
            utils.successReact(api, message.messageID);
        }

        if (key === 'botName') {
            config.botName = value;
            utils.successReact(api, message.messageID);
        }

        if (key === 'response') {
            config.response = value;
            utils.successReact(api, message.messageID);
        }

        if (key === 'threadID') {
            if (!value.match(/^\d+$/) || value.length !== 16) {
                utils.errorReact(api, message.messageID);
                return api.sendMessage('Invalid thread ID.', message.threadID);
            }
            config.threadID = value;
            utils.successReact(api, message.messageID);
        }

        if (key === 'apiKey') {
            config.weatherAPIKey = value;
            utils.successReact(api, message.messageID);
        }

        if (key === 'gcLock') {
            if (value === 'true') {
                config.gcLock = true;
                api.setMessageReaction('🔒', message.messageID);
                return api.sendMessage('Group chat lock enabled', message.threadID);
            }
            if (value === 'false') {
                config.gcLock = false;
                api.setMessageReaction('🔓', message.messageID);
                api.sendMessage('Group chat Lock disabled.', message.threadID);
            } else {
                utils.errorReact(api, message.messageID);
                return api.sendMessage('Invalid value. must be true or false.', message.threadID);
            }

            config.gcLock = value;
            utils.successReact(api, message.messageID);
        }

        fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, null, 2), (err) => {
            if (err) {
                api.sendMessage(`Error: can't set ${key} to ${value}`, message.threadID);
                utils.noticeReact(api, message);
                return log.error(err);
            }
            utils.successReact(api, message.messageID);
        });
    }
}