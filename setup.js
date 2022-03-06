var utils = require('./src/utils');
var config = require('./src/config.json');
var fs = require('fs');
var log = require('npmlog');
var inquirer = require('inquirer');

function checkIfEmpty(value) {
    if (value.length === 0) {
        return 'This field is required';
    }
    return true;
}

function checkIfEmail(value) {
    if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return 'Please enter a valid email address';
    }
    return true;
}

function checkIfThreadID(value) {
    if (!value.match(/^\d+$/) || value.length !== 16) {
        return 'Invalid thread ID';
    }
    return true;
}

// function that writes the data to the config file
function writeConfig(config) {
    fs.writeFile('./src/config.json', JSON.stringify(config, null, 2), (err) => {
        if (err) return log.error(err);
        log.info('config', 'Configuration file updated!');
    });
}

inquirer.prompt([{
    type: 'list',
    name: 'setup',
    message: 'What do you want to setup?',
    choices: ['Login', 'Config'],
}]).then(answers => {
    if (answers.setup === 'Login') {
        inquirer.prompt([{
                type: 'input',
                name: 'email',
                message: 'Enter your email address: ',
                validate: checkIfEmail,
            },
            {
                type: 'password',
                name: 'password',
                mask: '*',
                message: 'Enter your password: ',
                validate: checkIfEmpty,
            }
        ]).then(answers => {
            utils.fetchCookie(answers.email, answers.password).then(() => {
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'setup',
                    message: 'Do you want to setup the config file?',
                    default: false,
                }]).then(answers => {   
                    if (answers.setup === true) {
                        inquirer.prompt([
                            {
                                type: 'input',
                                name: 'prefix',
                                message: 'Enter the prefix:',
                                default: '.',
                            },
                            {
                                type: 'input',
                                name: 'threadID',
                                message: 'Enter your thread ID:',
                                validate: checkIfThreadID,
                            },
                            {
                                type: 'input',
                                name: 'botName',
                                message: 'Enter your bot name:',
                                default: 'Bot',
                            },
                            {
                                type: 'confirm',
                                name: 'gcLock',
                                message: 'Do you want to lock the GC? (yes/no):',
                                default: 'no',
                            }
                        ]).then(answers => {
                            config.prefix = answers.prefix;
                            config.threadID = answers.threadID;
                            config.botName = answers.botName;
                            if (answers.gcLock === 'yes') {
                                config.gcLock = true;
                            } else { config.gcLock = false; }
                            
                            config.gcLock = answers.gcLock;
                            writeConfig(config);
                            log.info('config', 'Configuration file updated!');
                        });
                    }
                })
            });
        });
    }
    if (answers.setup === 'Config') {
        inquirer.prompt([{
            type: 'list',
            name: 'config',
            message: 'What do you want to configure?',
            choices: ['Prefix', 'Bot name', 'Response', 'Thread ID', 'Weather API Key', 'GC Lock'],
        }]).then(answers => {
            if (answers.config === 'Prefix') {
                inquirer.prompt([{
                    type: 'input',
                    name: 'prefix',
                    message: 'Enter the prefix:',
                    validate: checkIfEmpty,
                }]).then(answers => {
                    config.prefix = answers.prefix;
                    writeConfig(config);
                });
            }
            if (answers.config === 'Bot name') {
                inquirer.prompt([{
                    type: 'input',
                    name: 'botName',
                    message: 'Enter the bot\'s name:',
                    validate: checkIfEmpty,
                }]).then(answers => {
                    config.botName = answers.botName;
                    writeConfig(config);
                });
            }
            if (answers.config === 'response') {
                inquirer.prompt([{
                    type: 'input',
                    name: 'response',
                    message: 'Enter the response:',
                }]).then(answers => {
                    config.response = answers.response;
                    writeConfig(config);
                });
            }
            if (answers.config === 'Thread ID') {
                inquirer.prompt([{
                    type: 'input',
                    name: 'threadID',
                    message: 'Enter the thread ID:',
                    validate: checkIfThreadID,
                }]).then(answers => {
                    config.threadID = answers.threadID;
                    writeConfig(config);
                });
            }
            if (answers.config === 'Weather API Key') {
                inquirer.prompt([{
                    type: 'input',
                    name: 'weatherAPIKey',
                    message: 'Enter the weather API key:',
                }]).then(answers => {
                    config.weatherAPIKey = answers.weatherAPIKey;
                    writeConfig(config);
                });
            }
            if (answers.config === 'GC Lock') {
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'gcLock',
                    message: 'Do you want to lock the GC?:',
                    default: false,
                }]).then(answers => {
                    config.gcLock = answers.gcLock;
                    writeConfig(config);
                });
            }
        });
    }
})