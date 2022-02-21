const puppeteer = require('puppeteer');
const fs = require('fs-extra');
var log = require('npmlog');
require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

if (email == undefined) return log.error('No Email!');
if (password == undefined) return log.error('No Password!');

if (!fs.existsSync(`${__dirname}/data/fbCookies.json`)) {
	fs.ensureFileSync(`${__dirname}/data/fbCookies.json`);
	log.info('cookie',"fbCookies.json don't exist so I created one!");
} else {
	log.info('cookie',"fbCookies.json exist! Proceeding...");
}

(async () => {
	log.info('cookie','Attempting to launch browser...');
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setDefaultNavigationTimeout(60000);
		await page.goto('https://www.facebook.com/');
		await page.waitForSelector('#email');
		try {
			await page.type('#email', email);
		} catch (err) {
			log.error('Email seems to be empty or incorrect!', err);
		}
		try {
			await page.type('#pass', password);
		} catch (err) {
			log.error('Password seems to be empty or incorrect!', err);
		}
		log.info('cookie', 'Submitting credentials!...');
		await page.click('[type="submit"]');
		await page.waitForNavigation();
		try {
			await page.click('div');
		} catch (err) {
			log.error('cookie', 'Error clicking div! Ignoring...');
		}
		log.info('cookie', 'Fetching Cookies...');
		cookies = await page.cookies();
		cookies = cookies.map(({
			name: key,
			...rest
		}) => ({
			key,
			...rest
		}));
		fs.writeFileSync(__dirname + '/data/fbCookies.json', JSON.stringify(cookies));
		log.info('cookie', 'Exiting...');
		await browser.close();

	} catch (err) {
		log.error('Exiting...', err);

	}
})();