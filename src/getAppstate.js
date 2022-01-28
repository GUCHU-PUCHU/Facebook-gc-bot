const puppeteer = require('puppeteer');
const fs = require('fs-extra');
require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

if (email == undefined) return console.log("No email!");
if (password == undefined) return console.log("No Password!");;

if (!fs.existsSync(`${__dirname}/data/fbCookies.json`)) {
	fs.ensureFileSync(`${__dirname}/data/fbCookies.json`);
	console.log("fbCookies.json don't exist so I created one!");
} else {
	console.log("fbCookies.json exist! Proceeding...");
}

(async () => {
	console.log('Attempting to launch browser...');
	try {
		// const browser = await puppeteer.launch({
		// 	headless: false,
		// 	product: 'firefox',
		// 	args: [
		// 		'-wait-for-browser'
		// 	]
		// });

		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setDefaultNavigationTimeout(60000);
		await page.goto('https://www.facebook.com/');
		await page.waitForSelector('#email');
		try {
			await page.type('#email', email);
		} catch (error) {
			console.log("Email seems to be empty or incorrect!");
			console.error(error);
		}
		try {
			await page.type('#pass', password);
		} catch (error) {
			console.log("Password seems to be empty or incorrect!");
			console.error(error);
		}
		console.log("Submitting credentials!...");
		await page.click('[type="submit"]');
		await page.waitForNavigation();
		await page.click('div');
		console.log("Fetching Cookies...");
		cookies = await page.cookies();
		cookies = cookies.map(({
			name: key,
			...rest
		}) => ({
			key,
			...rest
		}));
		fs.writeFileSync(__dirname + '/data/fbCookies.json', JSON.stringify(cookies));
		console.log("Exiting...");
		await browser.close();

	} catch (error) {
		console.error(error);
		console.log('exiting...');
	}
})();