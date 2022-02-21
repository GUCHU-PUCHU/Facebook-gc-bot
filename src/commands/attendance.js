const moment = require('moment');
const fs = require(`fs-extra`);
module.exports = {
	name: 'attendance',
	description: 'test!',
    args: true,
    adminOnly: true,
	execute(api, message, args, cmdMap, __dirname, config) {
        let tmDt = moment().format('llll');  
        let query = args[0];

        if (config.isRecording) {
            api.sendMessage(`I'm currently taking attendance. \nPlease cancel the command first.`, message.threadID);
            return;
        }

        else {
            config.attendArr = [];
            config.checkArr = [];
            config.isRecording = true;

            fs.createFile(__dirname + '/data/log/' + moment().format('MMMM-Do-YYYY_' + query + '.txt', 'utf-8'));
            
        }

        
	},
};