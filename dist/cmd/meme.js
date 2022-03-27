"use strict";
var fse = require('fs-extra');
module.exports = {
    name: 'meme',
    alias: ['me'],
    args: true,
    adminOnly: true,
    GcOnly: true,
    usage: '[ list | search < name | id > | < name | id > [text]]',
    description: 'Can be used to list all available memes, search for a meme, or create a meme. \n' +
        'If no arguments are given, the list of available memes will be shown. \n' +
        'If a search is given, the first result will be used. \n' +
        'If a search is given and no result is found, a new meme will be created. \n' +
        'Usage: \n' +
        '\t `meme list` - Lists all available memes. \n' +
        '\t `meme search <name>` - Searches for a meme by name. \n' +
        '\t `meme search <id>` - Searches for a meme by id. \n' +
        '\t `meme <name> [text]` - Creates a meme with the given name and text. \n' +
        '\t `meme <id> [text]` - Creates a meme with the given id and text. \n',
    info: 'Meme command.',
    cooldown: true,
    execute: async function (api, message, args, config, utils) {
        var fetch = require('node-fetch');
        const response = await fetch('https://api.imgflip.com/get_memes').then((res) => res.json());
        function sendMeme(meme) {
            if (!meme) {
                api.sendMessage('No meme found.', message.threadID);
                return;
            }
            let x = [];
            if (meme.name)
                x.push(`Name: ${meme.name}`);
            if (meme.id)
                x.push(`ID: ${meme.id}`);
            if (meme.url)
                x.push(`URL: ${meme.url}`);
            if (meme.box_count)
                x.push(`Box Count: ${meme.box_count}`);
            if (meme.width)
                x.push(`Width: ${meme.width}`);
            if (meme.height)
                x.push(`Height: ${meme.height}`);
            api.sendMessage(x.join('\n'), message.threadID);
        }
        switch (args[0]) {
            case 'list':
            case 'l':
                api.sendMessage(response.data.memes.map((meme) => `${meme.name} - ${meme.id}`).join('\n'), message.threadID);
                break;
            case 'search':
            case 's':
                if (isNaN(args[1])) {
                    // search by name
                    let meme = response.data.memes.find((meme) => meme.name.toLowerCase().includes(args[1].toLowerCase()));
                    sendMeme(meme);
                }
                else {
                    sendMeme(response.data.memes.find((meme) => meme.id == args[1]));
                }
                break;
            default:
                var text = args.slice(1).join(' ').split(';');
                let mID;
                if (isNaN(args[0])) {
                    // search by name
                    let meme = response.data.memes.find((meme) => meme.name.toLowerCase().includes(args[0].toLowerCase()));
                    if (!meme) {
                        api.sendMessage('No meme found.', message.threadID);
                        return;
                    }
                    mID = meme.id;
                }
                else {
                    let meme = response.data.memes.find((meme) => meme.id == args[0]);
                    if (!meme) {
                        api.sendMessage('No meme found.', message.threadID);
                        return;
                    }
                    mID = meme.id;
                }
                if (text.length > response.data.memes.find((meme) => meme.id == mID).box_count) {
                    let count = response.data.memes.find((meme) => meme.id == mID).box_count;
                    api.sendMessage(`Too many text boxes. Max: ${count}`, message.threadID);
                    return;
                }
                var params = new URLSearchParams();
                params.append('template_id', mID);
                params.append('username', config.imgflip.username);
                params.append('password', config.imgflip.password);
                for (let i = 0; i < text.length; i++) {
                    params.append(`boxes[${i}][text]`, text[i]);
                }
                let res = await fetch('https://api.imgflip.com/caption_image', {
                    method: 'POST',
                    body: params,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((res) => res.json());
                if (!res.success) {
                    api.sendMessage(res.error_message, message.threadID);
                    return;
                }
                fetch(res.data.url)
                    .then((res) => res.body.pipe(fse.createWriteStream('./dist/data/image.png')))
                    .catch((err) => {
                    api.sendMessage(err, message.threadID);
                });
                await utils.sleep(1000).then(() => {
                    let msg = {
                        body: '',
                        attachment: fse.createReadStream('./dist/data/image.png'),
                    };
                    api.sendMessage(msg, message.threadID);
                });
                break;
        }
    },
};
