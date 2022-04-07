var fse = require('fs-extra');
var path = require('path');
var log = require('../data/log');
var config = require('../data/config');
module.exports = async (message: any) => {
	if (!message) return;
	let thread_id = message.threadID;
	let author = message.senderID;
	let ctnt = message.body;
	let timestamp = message.timestamp;

	try {
		if (!log[thread_id]) {
			log[thread_id] = {
				_author: author,
				_lstmsg: ctnt,
				_timestamp: timestamp,
				[author]: {
					lstmsg: ctnt,
					timestamp: timestamp,
				},
			};
		}

		if (!ctnt.startsWith(config.prefix)) {
			log[thread_id]._author = author;
			log[thread_id]._lstmsg = ctnt;
			log[thread_id]._timestamp = timestamp;
		}
		// add author to log
		if (!log[thread_id][author]) {
			log[thread_id][author] = {
				lstmsg: ctnt,
				timestamp: timestamp,
			};
		}

		// update author's last message
		log[thread_id][author].lstmsg = ctnt;
		log[thread_id][author].timestamp = timestamp;

		fse.writeJsonSync(path.join(__dirname, '../data/log.json'), log, { spaces: 4 });
	} catch (error) {
		console.log(error);
		throw error;
	}
};
