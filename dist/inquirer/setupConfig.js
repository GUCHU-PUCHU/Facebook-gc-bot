"use strict";
var inquirer = require('inquirer');
var fse = require('fs-extra');
var path = require('path');
var utils = require('../utils');
var config = require(path.join(__dirname, '..', 'data', 'config.json'));
module.exports = () => {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'prefix',
            message: 'What is your prefix?',
            default: config.prefix,
        },
        {
            type: 'input',
            name: 'thread_id',
            message: 'What is your thread id?',
            validate: function (input) {
                if (isNaN(input) || input.length < 16) {
                    return 'Please enter a valid thread id';
                }
                return true;
            },
            default: config.thread_id,
        },
        {
            type: 'input',
            name: 'bot_name',
            message: 'What is your bot name?',
            validate: function (input) {
                if (input.length < 2) {
                    return 'Please enter a valid bot name';
                }
                return true;
            },
            default: config.bot_name,
        },
        {
            type: 'input',
            name: 'w_api_key',
            message: 'What is your weather api key?',
            default: config.w_api_key,
        },
        {
            type: 'input',
            name: 'response',
            message: 'What is your bot response?',
            default: config.response,
        },
        {
            type: 'confirm',
            name: 'gc_lock',
            message: 'Do you want to lock the group chat?',
            default: config.gc_lock,
        },
        {
            type: 'input',
            name: 'cooldown',
            message: 'Cooldown multiplier. (x * 1000 ms)',
            validate: function (input) {
                if (input.length === 0 || isNaN(input)) {
                    return 'Please enter a valid cooldown';
                }
                return true;
            },
            default: config.cooldown,
        },
    ])
        .then((answers) => {
        config.prefix = answers.prefix;
        config.thread_id = answers.thread_id;
        config.bot_name = answers.bot_name;
        config.w_api_key = answers.w_api_key;
        config.response = answers.response;
        config.gc_lock = answers.gc_lock;
        config.cooldown = answers.cooldown;
        fse.writeFileSync(path.join(__dirname, '..', 'data', 'config.json'), JSON.stringify(config, null, 2));
        console.log('Config updated!');
    })
        .then(() => {
        if (!fse.existsSync(utils.app_State)) {
            inquirer
                .prompt([
                {
                    type: 'confirm',
                    name: 'askFbCreds',
                    message: 'Do you want to setup facebook credentials?',
                    default: true,
                },
            ])
                .then((answers) => {
                if (answers.askFbCreds)
                    require(path.join(__dirname, '..', 'inquirer', 'fbCreds'))();
                else
                    console.log('Setup complete!');
            });
        }
    })
        .catch((err) => {
        console.log(err);
    });
};
