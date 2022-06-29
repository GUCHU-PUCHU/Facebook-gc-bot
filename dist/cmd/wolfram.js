"use strict";
var config = require('../data/config.json');
module.exports = {
    name: 'wolfram',
    alias: ['wolfram', 'wolframalpha', 'wa'],
    args: true,
    adminOnly: false,
    GcOnly: false,
    usage: '[query]',
    description: 'Get Wolfram Alpha results. Only gives short answers at the moment.',
    info: 'Get Wolfram Alpha results.',
    cooldown: true,
    execute: async function (api, message, args, utils) {
        if (config.wolframAlphaAppID === '') {
            utils.errorReact(api, message.messageID);
            return api.sendMessage('Wolfram Alpha App ID is not set.', message.threadID);
        }
        const WolframAlphaAPI = require('wolfram-alpha-api');
        const waApi = WolframAlphaAPI(config.wolframAlphaAppID);
        let thread_id = message.threadID;
        let query = args.join(' ');
        utils.waitReact(api, message.messageID);
        waApi
            .getShort(query)
            .then((res) => {
            api.sendMessage(`Query: ${query}\n\n` + `Answer: \n  ${res}`, thread_id);
            utils.successReact(api, message.messageID);
        })
            .catch((err) => {
            api.sendMessage(`${err}`, thread_id);
            utils.failReact(api, message.messageID);
        });
    },
};
