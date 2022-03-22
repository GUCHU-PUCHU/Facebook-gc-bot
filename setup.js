var utils = require('./src/utils');
var fse = require('fs-extra');
var log = require('npmlog');

if (fse.ensureFileSync('./src/config.json')) {
	log.info('config', 'Configuration not file found! creating one...');
	fse.writeJSONSync('./src/config.json', utils.defaultConfig, { spaces: 4 });
}

if (fse.ensureFileSync('./src/data/threadCache.json')) {
	log.info('config', 'Cache not file found! Creating one...');
	fse.writeJSONSync('./src/data/threadCache.json', {'threads': []}, {spaces: 4});
}

var config = require('./src/config.json');
var inquirer = require('inquirer');

function checkIfEmpty(value) {
	if (value.length === 0) {
		return 'This field is required';
	}
	return true;
}

function checkIfEmail(value) {
	if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
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
					if (answers.setup == true) {
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
								message: 'Do you want to lock the GC?:',
								default: false,
							}
						]).then(answers => {
							let arg;
							arg.prefix = answers.prefix;
							arg.threadID = answers.threadID;
							arg.botName = answers.botName;
							arg.gcLock = answers.gcLock;
							utils.writeConfig(arg);
						});
					}
					else return;
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
					utils.writeConfig(config);
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
					utils.writeConfig(config);
				});
			}
			if (answers.config === 'response') {
				inquirer.prompt([{
					type: 'input',
					name: 'response',
					message: 'Enter the response:',
				}]).then(answers => {
					config.response = answers.response;
					utils.writeConfig(config);
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
					utils.writeConfig(config);
				});
			}
			if (answers.config === 'Weather API Key') {
				inquirer.prompt([{
					type: 'input',
					name: 'weatherAPIKey',
					message: 'Enter the weather API key:',
				}]).then(answers => {
					config.weatherAPIKey = answers.weatherAPIKey;
					utils.writeConfig(config);
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
					utils.writeConfig(config);
				});
			}
		});
	}
}) 
// obviously, this is not the best way to do this, but it works for now
// TODO: make this better