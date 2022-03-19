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
    async execute(api, message, args, cmdMap, __dirname, ) {

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
            log.info('gcLock', value);
            if (value === 'true') {
                value =  true;
                api.setMessageReaction('🔒', message.messageID);
            }
            if (value === 'false') {
                value = false;
                api.setMessageReaction('🔓', message.messageID);
            }
            if (config.gcLock == value) {
                utils.noticeReact(api, message.messageID);
                return api.sendMessage('Nothing changed.', message.threadID);
            }
            log.info('gcLock0', value);
            if (typeof value !== 'boolean') {
                utils.errorReact(api, message.messageID);
                return api.sendMessage('Invalid value. must be true or false.', message.threadID);
            }
            config.gcLock = value;
        }

        if (key === 'status') {
            let data = [];
            data.push('Current Bot Configuration:');
            for (let key in config) {
                if (config[key] === "") data.push(`${key}:\n    >> none`);
                else data.push(`\`${key}\`:\n    >> ${config[key]}`);
            }
            api.sendMessage(data.join('\n'), message.threadID);
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