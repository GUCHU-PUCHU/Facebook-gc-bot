"use strict";
var config = require('../data/config');
module.exports = {
    name: 'urban',
    alias: ['urban', 'urbandictionary', 'ud'],
    args: true,
    adminOnly: false,
    GcOnly: true,
    usage: '<term>',
    description: `Search for a term on Urban Dictionary.\n` + `Usage: \n` + `\t ${config.prefix}urban <term>\n`,
    info: 'Search for a term on Urban Dictionary.',
    cooldown: true,
    execute: function (api, message, args) {
        var fetch = require('node-fetch');
        let x = [];
        let term = args.join(' ');
        fetch(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`)
            .then((res) => res.json())
            .then((json) => {
            if (json.list.length === 0) {
                return api.sendMessage(`No results found for \`${term}\`.`, message.threadID);
            }
            let result = json.list[0];
            x.push('*' + result.word + '*');
            x.push('Definition:\n\t' + result.definition);
            x.push('Example:\n' + result.example);
            x.push('Link:\n\t' + result.permalink);
            api.sendMessage(x.join('\n\n'), message.threadID);
        });
    },
};
