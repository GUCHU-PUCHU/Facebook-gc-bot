const prompt = require('prompt');
const utils = require('./src/utils');
const fs = require('fs');

const config = [
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
        default: '',
        required: true,
    },
    {
        name: 'weatherAPIKey',
        description: 'Weather API Key (optional)',
        default: '',
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
    prompt.get(config, function (err, result) {
        if (err) return console.log(err);
        fs.writeFileSync('./src/config.json', JSON.stringify(result));
        return;
    });
}

if (process.argv[2] === '--login' || process.argv[2] === '-l') {
    prompt.start();
    prompt.get(properties, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        utils.fetchCookie(result.email, result.password);
        return;
    })
}

else if (process.argv[2] === '--help' || process.argv[2] === '-h') {
    console.log('Usage: node setup [ --config | --login | --help]');
    console.log('--config   : Creates a config file for the bot');
    console.log('--login    : Logs in to Facebook');
    console.log('--help     : Displays this message');
    return;
}