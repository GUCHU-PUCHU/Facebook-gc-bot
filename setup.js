const prompt = require('prompt');
const utils = require('./src/utils');
const config = require('./src/config.json');
const fs = require('fs');
const log = require('npmlog');

const dConfig = [
    {
        name: 'prefix',
        description: 'Bot\'s prefix',
        default: '.',
        required: true,
    },
    {
        name: 'botName',
        description: 'Bot\'s name',
        default: 'bot',
        required: true,
    },
    {
        name: 'response',
        description: 'Response of the bot when @botName is mentioned',
        default: '',
        required: false,
    },
    {
        name: 'threadID',
        description: 'Chat\s thread ID',
        pattern: /^\d+$/,
        required: true,
    },
    {
        name: 'weatherAPIKey',
        description: 'Weather API Key (optional)',
        default: '',
    },
    {
        name: 'gcLock',
        description: 'Are you going to use this bot in multiple group chat? false/true?',
        type: 'boolean',
        default: false,
    }
];

const properties = [
    {
        name: 'email',
        validator: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        warning: 'Must be a valid e-mail address',
        required: true
    },
    {
        name: 'password',
        hidden: true,
        replace: '*',
        required: true
    }
];

if (process.argv[2] === '--config' || process.argv[2] === '-c') {
    prompt.start();

    switch (process.argv[3]) {
        case '--prefix':
        case '-p':
            prompt.get(['prefix'], (err, result) => {
                if (err) return log.error(err);
                config.prefix = result.prefix;
                fs.writeFile('./src/config.json', JSON.stringify(config, null, 2), (err) => {
                    if (err) return log.error(err);
                    log.info('config', 'Prefix updated!');
                });
                return;
            });
            break;
        
        case '--botName':
        case '-b':
            prompt.get(['botName'], (err, result) => {
                if (err) return log.error(err);
                config.botName = result.botName;
                fs.writeFile('./src/config.json', JSON.stringify(config, null, 2), (err) => {
                    if (err) return log.error(err);
                    log.info('config', 'Bot\'s name updated!');
                });
                return;
            });
            break;
        
        case '--response':
        case '-r':
            prompt.get(['response'], (err, result) => {
                if (err) return log.error(err);
                config.response = result.response;
                fs.writeFile('./src/config.json', JSON.stringify(config, null, 2), (err) => {
                    if (err) return log.error(err);
                    log.info('config', 'Response updated!');
                });
                return;
            });
            break;
    
        case '--threadID':
        case '-t':
            prompt.get(['threadID'], (err, result) => {
                if (err) return log.error(err);
                if (result.threadID.length !== 16) return log.error('config', 'Thread ID must be 16 digits long!');
                if (!result.threadID.match(/^\d+$/)) return log.error('config', 'Thread ID must be a number!');
                config.threadID = result.threadID;
                fs.writeFile('./src/config.json', JSON.stringify(config, null, 2), (err) => {
                    if (err) return log.error(err);
                    log.info('config', 'Thread ID updated to ' + config.threadID);
                });
                return;
            });
            break;

        case '--weatherAPIKey':
        case '-w':
            prompt.get(['weatherAPIKey'], (err, result) => {
                if (err) return log.error(err);
                config.weatherAPIKey = result.weatherAPIKey;
                fs.writeFile('./src/config.json', JSON.stringify(config, null, 2), (err) => {
                    if (err) return log.error(err);
                    log.info('config', 'Weather API Key updated!');
                });
                return;
            });
            break;

        case '--gcLock':
        case '-g':
            prompt.get(['gcLock'], (err, result) => {
                if (err) return log.error(err);
                if (result.gcLock === 'true') {
                    config.gcLock = true;
                }
                if (result.gcLock === 'false') {
                    config.gcLock = false;
                }
                else {
                    config.gcLock = false;
                    log.info('config', 'unknown value, defaulting to false.');
                }

                config.gcLock = result.gcLock;
                fs.writeFile('./src/config.json', JSON.stringify(config, null, 2), (err) => {
                    if (err) return log.error(err);
                    log.info('config', 'Group Chat Lock updated!');
                });
                return;
            });
            break;
        
        default: 
            prompt.get(dConfig, (err, result) => {
                if (err) return;
                fs.writeFile('./src/config.json', JSON.stringify(result, null, 2), (err) => {
                    if (err) return log.error(err);
                    log.info('config', 'Configuration file updated!');
                });
            });
    } // Lazy is my middle name.
}

// Login and get cookies
if (process.argv[2] === '--login' || process.argv[2] === '-l') {
    prompt.start();
    prompt.get(properties, function (err, result) {
        if (err) {
            log.error(err);
            return;
        }
        utils.fetchCookie(result.email, result.password);
        return;
    })
}

else if (process.argv[2] === '--help' || process.argv[2] === '-h') {
    console.log('Usage: node setup [ --config [-p, -b, -r, -t, -w, -g] | --login , -l | --help, -h]');
    console.log('--login, -l                     : Logs in to Facebook');
    console.log('--config                        : Creates a config file for the bot');
    console.log('          -p, --prefix          : Sets the prefix for the bot');
    console.log('          -b, --botName         : Sets the bot\'s name');
    console.log('          -r, --response        : Sets the response for the bot');
    console.log('          -t, --threadID        : Sets the thread ID for the bot');
    console.log('          -w, --weatherAPIKey   : Sets the weather API key for the bot');
    console.log('          -g, --gcLock          : Sets the group chat lock for the bot');
    console.log('--help, -h                      : Displays this message');
    return;
}