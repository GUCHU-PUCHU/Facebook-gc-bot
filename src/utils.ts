var fse = require('fs-extra');
var path = require('path');
var inquirer = require('inquirer');
var puppeteer = require('puppeteer');
var _fetch = require('node-fetch');
module.exports = {
	// Paths and config
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

	sleep: async function (ms: any) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	arrBullet: function (arr: any, { bullet = '-', indent = 0 }: { bullet?: any; indent?: any }) {
		return arr.map((item: any) => `${' '.repeat(indent)}${bullet} ${item}`).join('\n');
	},

	arrNumBullet: function (arr: any) {
		return arr.map((item: any, index: any) => `${index + 1}. ${item}`).join('\n');
	},

	trimString: function (str: any, { length = 50, suffix = '...' }: { length?: any; suffix?: any }) {
		if (str.length > length) {
			return `${str.substring(0, length)}${suffix}`;
		} else {
			return str;
		}
	},

	// function for dealing with large amount of characters beyond the character limit
	sendMessage: async function (
		txt: string,
		api: any,
		id: number,
		{ limit = 2000, delay = 0 }: { limit?: number; delay?: number }
	) {
		let chunks: any[] = [];
		for (let i = 0; i < txt.length; i += limit) {
			chunks.push(txt.substr(i, i + limit));
		}
		// send the first chunk
		await api.sendMessage(chunks[0], id);
		// send the rest of the chunks

		for (let i = 1; i < chunks.length; i++) {
			await this.sleep(delay * 1000);
			await api.sendMessage(chunks[i], id);
		}
	},

	successReact: function (api: { setMessageReaction: any }, message_id: any) {
		api.setMessageReaction('✅', message_id);
	},
	failReact: function (api: { setMessageReaction: any }, message_id: any) {
		api.setMessageReaction('❌', message_id);
	},
	waitReact: function (api: { setMessageReaction: any }, message_id: any) {
		api.setMessageReaction('⏳', message_id);
	},
};

// this is shit code
// TODO: fix this shit code
