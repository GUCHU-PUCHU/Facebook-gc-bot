var puppeteer = require('puppeteer');
var path = require('path');
var fse = require('fs-extra');

module.exports = async (email: string, password: string) => {
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
		fse.outputJson(path.join(__dirname, '..', 'data', 'appState.json'), cookies, { spaces: 4 });
		browser.close();
		return console.log('done');
	} catch (error) {
		console.error(error);
	}
	require(path.join(__dirname, '../index'));
};
