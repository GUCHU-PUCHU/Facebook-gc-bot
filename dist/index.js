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
if (!fse.existsSync(utils.app_State)) {
    fse.outputJsonSync(utils.app_State, {}, { spaces: 4 });
}
var config = fse.readJsonSync(utils.config_file);
inquirer
    .prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: ['Start', 'Setup login', 'Change config', 'exit'],
    },
])
    .then((answers) => {
    switch (answers.action) {
        case 'Start':
            console.log('Starting...');
            console.log('Hit [Ctrl+C] to exit at any time.');
            utils.start();
            break;
        case 'Setup login':
            utils.login();
            break;
        case 'Change config':
            console.log('Hit [Enter] to keep the current value.');
            utils.changeConfig();
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
