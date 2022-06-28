"use strict";
var path = require('path');
var moment = require('moment');
var fse = require('fs-extra');
var config = require('../data/config');
module.exports = {
    name: 'threadinfo',
    alias: ['ti'],
    args: false,
    adminOnly: false,
    GcOnly: true,
    usage: '',
    description: 'Get info about the current thread.',
    info: 'Get info about the current thread.',
    cooldown: false,
    execute: async function (api, message) {
        var fetch = require('node-fetch');
        let thread_id = message.threadID;
        let gInfo = JSON.parse(fse.readFileSync(path.join(__dirname, '..', 'data/gInfo.json'), 'utf8'));
        if (!gInfo[thread_id]) {
            api.getThreadInfo(thread_id, (err, info) => {
                if (err)
                    return console.error(err);
                gInfo[thread_id] = info;
                fse.writeFileSync(path.join(__dirname, 'data/gInfo.json'), JSON.stringify(gInfo, null, 4));
            });
        }
        fse.ensureDirSync(path.join(__dirname, '..', 'data', 'img'));
        let img = await fetch(gInfo[thread_id].imageSrc);
        let imgPath = path.join(__dirname, '..', 'data', 'img', `${thread_id}_temp.jpg`);
        await fse.writeFile(imgPath, await img.buffer());
        let msg = {
            body: `*${gInfo[thread_id].name}*\n` +
                `The ID is *${gInfo[thread_id].threadID}*\n` +
                `with *${gInfo[thread_id].participantIDs.length}* participants\n` +
                `and *${gInfo[thread_id].messageCount}* messages sent.\n`,
            attachment: fse.createReadStream(imgPath),
        };
        api.sendMessage(msg, thread_id);
    },
};
