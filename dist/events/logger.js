"use strict";
var fse = require('fs-extra');
var path = require('path');
var log = require('../data/log');
var config = require('../data/config');
var moment = require('moment');
module.exports = async (api, message) => {
    var uInfo = fse.readJsonSync(path.join(__dirname, '../data/uInfo.json'));
    if (!message)
        return;
    let thread_id = message.threadID;
    let authorID = message.senderID;
    let author = message.senderID;
    let ctnt = message.body;
    let timestamp = message.timestamp;
    try {
        if (!ctnt)
            return;
        if (ctnt.startsWith(config.prefix + 'snipe'))
            return;
        if (uInfo[thread_id] && uInfo[thread_id][authorID])
            author = uInfo[thread_id][authorID].name;
        if (!log[thread_id]) {
            log[thread_id] = {
                _author: author,
                _lstmsg: ctnt,
                _timestamp: timestamp,
                [authorID]: {
                    author: author,
                    lstmsg: ctnt,
                    timestamp: timestamp,
                },
            };
        }
        if (!log[thread_id][authorID]) {
            log[thread_id][authorID] = {
                author: author,
                lstmsg: ctnt,
                timestamp: timestamp,
            };
        }
        if (log[thread_id]) {
            log[thread_id]._author = author;
            log[thread_id]._lstmsg = ctnt;
            log[thread_id]._timestamp = timestamp;
        }
        if (log[thread_id][authorID]) {
            if (ctnt.startsWith(config.prefix))
                return;
            log[thread_id][authorID].author = author;
            log[thread_id][authorID].lstmsg = ctnt;
            log[thread_id][authorID].timestamp = timestamp;
        }
        fse.writeJsonSync(path.join(__dirname, '../data/log.json'), log, { spaces: 4 });
    }
    catch (error) {
        console.log('Something went wrong with the logger: ' + error);
        throw error;
    }
};
