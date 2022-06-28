"use strict";
var fse = require('fs-extra');
var path = require('path');
var inquirer = require('inquirer');
var puppeteer = require('puppeteer');
var _fetch = require('node-fetch');
module.exports = {
    default_config: {
        prefix: '!',
        bot_name: '',
        response: '',
        thread_id: '',
        w_api_key: '',
        gc_lock: false,
        cooldown: '5',
        imgflip: {
            username: 'imgflip_hubot',
            password: 'imgflip_hubot',
        },
    },
    config_file: path.join('./dist/data', 'config.json'),
    log_file: path.join('./dist/data', 'log.json'),
    app_State: path.join('./dist/data', 'appState.json'),
    pins: path.join('./dist/data', 'pins.json'),
    gInfo: path.join('./dist/data', 'gInfo.json'),
    uInfo: path.join('./dist/data', 'uInfo.json'),
    sleep: async function (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    randomSleep: async function (min, max) {
        return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));
    },
    arrBullet: function (arr, { bullet = '-', indent = 0 }) {
        return arr.map((item) => `${' '.repeat(indent)}${bullet} ${item}`).join('\n');
    },
    arrNumBullet: function (arr) {
        return arr.map((item, index) => `${index + 1}. ${item}`).join('\n');
    },
    trimString: function (str, { length = 50, suffix = '...' }) {
        if (str.length > length) {
            return `${str.substring(0, length)}${suffix}`;
        }
        else {
            return str;
        }
    },
    sendMessage: async function (txt, api, id, { limit = 2000, delay = 0 }) {
        let chunks = [];
        for (let i = 0; i < txt.length; i += limit) {
            chunks.push(txt.substr(i, i + limit));
        }
        await api.sendMessage(chunks[0], id);
        for (let i = 1; i < chunks.length; i++) {
            await this.sleep(delay * 1000);
            await api.sendMessage(chunks[i], id);
        }
    },
    successReact: function (api, message_id) {
        api.setMessageReaction('✅', message_id);
    },
    failReact: function (api, message_id) {
        api.setMessageReaction('❌', message_id);
    },
    waitReact: function (api, message_id) {
        api.setMessageReaction('⏳', message_id);
    },
    errorReact: function (api, message_id) {
        api.setMessageReaction('❗', message_id);
    },
    seenReact: function (api, message_id) {
        api.setMessageReaction('👁', message_id);
    },
};
