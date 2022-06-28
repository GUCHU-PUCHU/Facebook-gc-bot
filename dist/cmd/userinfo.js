"use strict";
var path = require('path');
var _fetch = require('node-fetch');
var fse = require('fs-extra');
var config = require('../data/config');
module.exports = {
    name: 'userinfo',
    alias: ['userinfo', 'user', 'lookup', 'profile', 'info', 'whois'],
    args: false,
    adminOnly: true,
    GcOnly: false,
    usage: '[ userid | @user ]',
    description: 'Get user info.\n' + 'Usage: \n' + '\t ' + config.prefix + 'userinfo [ userid | @user ]\n',
    info: 'Get user info.',
    cooldown: true,
    execute: async function (api, message, args, utils) {
        let mentions = message.mentions;
        let thread_id = message.threadID;
        let query = args[0];
        let id;
        if (isNaN(query) || query.startsWith('@')) {
            id = Object.keys(mentions)[0];
        }
        else {
            id = query;
        }
        var uInfo = fse.readJsonSync(path.join(__dirname, '..', 'data', 'uInfo.json'));
        if (!query)
            id = message.senderID;
        if (!uInfo[thread_id]) {
            uInfo[thread_id] = {};
        }
        if (!uInfo[thread_id][id]) {
            api.sendMessage('No user info found... Generating. \nPlease use the command again.', thread_id);
            api.getUserInfo(id, (err, info) => {
                if (err)
                    return console.error(err);
                uInfo[thread_id][id] = info[id];
                fse.writeFileSync(path.join(__dirname, '..', 'data', 'uInfo.json'), JSON.stringify(uInfo, null, 4));
            });
            return;
        }
        let info = uInfo[thread_id][id];
        try {
            let reply = '*' +
                info.name +
                '*\n' +
                'First Name: ' +
                info.firstName +
                '\n' +
                'Vanity: ' +
                info.vanity +
                '\n' +
                'Profile Url: ' +
                info.profileUrl +
                '\n';
            api.sendMessage(reply, thread_id);
        }
        catch (error) {
            console.log(error);
            api.sendMessage('Something went wrong...', thread_id);
        }
    },
};
