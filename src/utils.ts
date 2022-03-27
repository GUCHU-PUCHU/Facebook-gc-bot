var fse = require('fs-extra');
var path = require('path');
var inquirer = require('inquirer');
var puppeteer = require('puppeteer');
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

	// Checks
	checkIfEmpty: function (str: string) {
		if (str.length === 0) {
			return 'This field is required';
		}
		return true;
	},

	checkIfEmail: function (str: string) {
		var re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(String(str).toLowerCase())) {
			return true;
		}
		return 'Please enter a valid email address.';
	},
	checkIfThreadId: function (str: string) {
		if (/^\d{16}$/.test(str)) {
			return true;
		}
		return 'Please enter a valid thread id.';
	},

	// setup functions
	writeToConfig: function (obj: { [x: string]: any }, callback: (arg0: { [x: string]: any }) => void) {
		fse.outputJson(this.config_file, obj, { spaces: 4 }, callback);
	},

	fetchCookies: async function (email: string, password: string) {
		console.log('Please wait...');
		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.setDefaultNavigationTimeout(60000);
			await page.goto('https://www.facebook.com/');
			await page.waitForSelector('#email');
			await page.type('#email', email);
			await page.type('#pass', password);
			await page.click('[type="submit"]');
			await page.waitForNavigation();
			let cookies = await page.cookies();
			cookies = cookies.map(({ name: key, ...rest }: { name: any; [x: string]: any }) => ({ key, ...rest }));
			fse.outputJson(this.app_State, cookies, { spaces: 4 });
			browser.close();
			return console.log('done');
		} catch (error) {
			console.error(error);
		}
	},

	start: function () {
		// run the bot.js file
		require('./bot');
	},

	login: function () {
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'email',
					message: 'What is your email?',
					validate: this.checkIfEmail,
				},
				{
					type: 'password',
					name: 'password',
					message: 'What is your password?',
					mask: '*',
					validate: this.checkIfEmpty,
				},
			])
			.then((answers: { email: any; password: any }) => {
				var email = answers.email;
				var password = answers.password;
				this.fetchCookies(email, password);
				require('./index');
			});
	},

	imgLogin: function () {
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'username',
					message: 'What is your username?',
					validate: this.checkIfEmpty,
				},
				{
					type: 'password',
					name: 'password',
					message: 'What is your password?',
					mask: '*',
					validate: this.checkIfEmpty,
				},
			])
			.then((answers: { username: any; password: any }) => {
				const config = fse.readJsonSync(this.config_file);
				config.imgflip.username = answers.username;
				config.imgflip.password = answers.password;
				this.writeToConfig(config, () => {
					console.log('done');
					require('./index');
				});
			});
	},

	changeConfig: function () {
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'prefix',
					message: 'What is your prefix?',
					default: fse.readJsonSync(this.config_file).prefix,
				},
				{
					type: 'input',
					name: 'thread_id',
					message: 'What is your thread id?',
					default: fse.readJsonSync(this.config_file).thread_id,
				},
				{
					type: 'input',
					name: 'bot_name',
					message: 'What is your bot name?',
					default: fse.readJsonSync(this.config_file).bot_name,
				},
				{
					type: 'input',
					name: 'w_api_key',
					message: 'What is your weather api key?',
					default: fse.readJsonSync(this.config_file).w_api_key,
				},
				{
					type: 'input',
					name: 'response',
					message: 'What is your bot response?',
					default: fse.readJsonSync(this.config_file).response,
				},
				{
					type: 'confirm',
					name: 'gc_lock',
					message: 'Do you want to lock the group chat?',
					default: fse.readJsonSync(this.config_file).gc_lock,
				},
				{
					type: 'input',
					name: 'cooldown',
					message: 'Cooldown multiplier. (x * 1000 ms)',
					default: fse.readJsonSync(this.config_file).cooldown,
				},
			])
			.then(
				(answers: {
					prefix: any;
					thread_id: any;
					bot_name: any;
					w_api_key: any;
					response: any;
					gc_lock: any;
					cooldown: any;
				}) => {
					const config = fse.readJsonSync(this.config_file);
					config.prefix = answers.prefix;
					if (this.checkIfThreadId(answers.thread_id) !== true) {
						answers.thread_id = config.thread_id;
					}
					config.thread_id = answers.thread_id;
					config.bot_name = answers.bot_name;
					config.w_api_key = answers.w_api_key;
					config.response = answers.response;
					if (answers.gc_lock === true) {
						config.gc_lock = true;
					} else {
						config.gc_lock = false;
					}
					config.gc_lock = answers.gc_lock;
					if (isNaN(answers.cooldown)) {
						answers.cooldown = config.cooldown;
					}
					config.cooldown = answers.cooldown;
					this.writeToConfig(config, () => {
						console.log('done');
					});
				}
			);
	},

	sleep: async function (ms: any) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	arrBullet: function (arr: any, { bullet = '-', indent = 0 }: { bullet?: any; indent?: any }) {
		return arr.map((item: any) => `${' '.repeat(indent)}${bullet} ${item}`).join('\n');
	},

	trimString: function (str: any, { length = 50, suffix = '...' }: { length?: any; suffix?: any }) {
		if (str.length > length) {
			return `${str.substring(0, length)}${suffix}`;
		} else {
			return str;
		}
	},

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
		let interval = setInterval(async () => {
			if (chunks.length) {
				await api.sendMessage(chunks.shift(), id);
			} else {
				clearInterval(interval);
			}
		}, delay * 1000);
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
