"use strict";
var fse = require('fs-extra');
var config = require('../data/config');
var cache = [];
module.exports = {
    name: 'listing',
    alias: ['attendance', 'att', 'list', 'lst'],
    args: true,
    adminOnly: false,
    GcOnly: true,
    usage: '[ start <limit?> <details?> | stop | status | add <index>  | remove <index> | reset ]',
    description: 'Manage List.\n' +
        '\t start <limit?> <details?> - Start recording.\n' +
        '\t stop - Stop list.\n' +
        '\t status - Show list status.\n' +
        '\t add <string> - Add an object to the  list.\n' +
        '\t remove <index> - Remove a object from the list.\n' +
        '\t reset - Reset list.\n',
    info: 'For listing stuff.',
    cooldown: false,
    execute: function (api, message, args, utils) {
        let threadID = message.threadID;
        let msgID = message.messageID;
        var txt = [];
        if (!cache[threadID]) {
            cache[threadID] = {
                isActive: false,
                message_id: null,
                date: '',
                limit: 0,
                details: '',
                list: [],
            };
        }
        function reset() {
            cache[threadID] = {
                isActive: false,
                message_id: null,
                date: '',
                limit: 0,
                details: '',
                list: [],
            };
        }
        switch (args[0]) {
            case 'start':
            case 'go':
            case 'begin':
                if (cache[threadID].isActive) {
                    api.sendMessage('List is already active.', threadID);
                    utils.failReact(api, message);
                    return;
                }
                cache[threadID].isActive = true;
                cache[threadID].limit = args[1] ? parseInt(args[1]) : 0;
                cache[threadID].details = args[2] ? args.slice(2).join(' ') : '';
                cache[threadID].date = moment().format('MMMM Do YYYY, h:mm:ss a');
                cache[threadID].list = [];
                api.sendMessage('List started.', threadID);
                break;
            case 'stop':
            case 'end':
                if (!cache[threadID].isActive) {
                    api.sendMessage('List is not active.', threadID);
                    utils.failReact(api, message);
                    return;
                }
                cache[threadID].isActive = false;
                api.sendMessage('List stopped.', threadID);
                txt.push(cache[threadID].date);
                if (cache[threadID].details)
                    txt.push(cache[threadID].details);
                if (cache[threadID].limit)
                    txt.push(`Limit: ${cache[threadID].limit}`);
                txt.push(`Total: ${cache[threadID].list.length}`);
                txt.push(`List:`);
                cache[threadID].list.forEach((item) => {
                    txt.push(`\t${item}`);
                });
                utils.sendMessage(txt.join('\n'), api, message.threadID, { limit: 2000 });
                reset();
                break;
            case 'status':
            case 'stat':
                if (!cache[threadID].isActive) {
                    api.sendMessage('List is not active.', threadID);
                    utils.failReact(api, message);
                    return;
                }
                txt.push(cache[threadID].date);
                if (cache[threadID].details)
                    txt.push(cache[threadID].details);
                if (cache[threadID].limit)
                    txt.push(`Limit: ${cache[threadID].limit}`);
                txt.push(`Total: ${cache[threadID].list.length}`);
                txt.push(`List:`);
                cache[threadID].list.forEach((item, index) => {
                    txt.push(`\t${index + 1}. ${item}`);
                });
                utils.sendMessage(txt.join('\n'), api, message.threadID, { limit: 2000 });
                break;
            case 'add':
            case 'a':
                if (!cache[threadID].isActive) {
                    api.sendMessage('List is not active.', threadID);
                    utils.failReact(api, message);
                    return;
                }
                if (cache[threadID].limit && cache[threadID].list.length >= cache[threadID].limit) {
                    api.sendMessage('List is full.', threadID);
                    txt.push(cache[threadID].date);
                    if (cache[threadID].details)
                        txt.push(cache[threadID].details);
                    txt.push(`Total: ${cache[threadID].list.length}`);
                    txt.push(`List:`);
                    cache[threadID].list.forEach((item, index) => {
                        txt.push(`\t${index + 1}. ${item}`);
                    });
                    utils.sendMessage(txt.join('\n'), api, message.threadID, { limit: 2000 });
                    reset();
                    return;
                }
                cache[threadID].list.push(args.slice(1).join(' '));
                api.sendMessage('Added.', threadID);
                break;
            case 'remove':
            case 'rm':
                if (!cache[threadID].isActive) {
                    api.sendMessage('List is not active.', threadID);
                    utils.failReact(api, message);
                    return;
                }
                if (args[1] && !isNaN(parseInt(args[1]))) {
                    cache[threadID].list.splice(parseInt(args[1]) - 1, 1);
                    api.sendMessage('Removed.', threadID);
                    break;
                }
                const index = cache[threadID].list.indexOf(args.slice(1).join(' '));
                if (index > -1) {
                    cache[threadID].list.splice(index, 1);
                    api.sendMessage('Removed.', threadID);
                    break;
                }
                api.sendMessage('Item not found.', threadID);
                break;
            case 'clear':
            case 'clr':
            case 'reset':
                if (!cache[threadID].isActive) {
                    api.sendMessage('List is not active.', threadID);
                    utils.failReact(api, message);
                    return;
                }
                cache[threadID].list = [];
                api.sendMessage('Cleared.', threadID);
                break;
        }
    },
};
