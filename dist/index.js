"use strict";
var inquirer = require('inquirer');
var utils = require('./utils');
var fse = require('fs-extra');
var path = require('path');
if (!fse.existsSync(utils.config_file)) {
    fse.outputJsonSync(utils.config_file, utils.default_config, { spaces: 4 });
}
if (!fse.existsSync(utils.log_file)) {
    fse.outputJsonSync(utils.log_file, {}, { spaces: 4 });
}
if (!fse.existsSync(utils.pins)) {
    fse.outputJsonSync(utils.pins, {}, { spaces: 4 });
}
if (!fse.existsSync(utils.gInfo)) {
    fse.outputJsonSync(utils.gInfo, {}, { spaces: 4 });
}
var config = fse.readJsonSync(utils.config_file);
inquirer
    .prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: ['Start', 'Setup FB account', 'Setup Imgflip account', 'Change config', 'exit'],
    },
])
    .then((answers) => {
    switch (answers.action) {
        case 'Start':
            console.log('Checking config...\n');
            if (!config.thread_id)
                return require('./inquirer/setupConfig');
            console.log('Checking if Appstate exist...\n');
            if (!fse.existsSync(utils.app_State))
                return require('./inquirer/fbCreds');
            console.log('Starting...\n' + 'You can always hit [Ctrl + C] to exit the bot.\n');
            require('./bot');
            break;
        case 'Setup FB account':
            require('./inquirer/fbCreds');
            break;
        case 'Setup Imgflip account':
            require('./inquirer/imgflipCreds');
            break;
        case 'Change config':
            console.log('Hit [Enter] to keep the current value.');
            require('./inquirer/setupConfig');
            break;
        case 'exit':
            console.log('Bye!');
            process.exit();
            break;
        default:
            console.log('Bye!');
            process.exit();
            break;
    }
});
