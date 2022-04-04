"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var puppeteer = require('puppeteer');
var path = require('path');
var fse = require('fs-extra');
module.exports = async (email, password) => {
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
        cookies = cookies.map((_a) => {
            var { name: key } = _a, rest = __rest(_a, ["name"]);
            return (Object.assign({ key }, rest));
        });
        fse.outputJson(path.join(__dirname, '..', 'data', 'app_state.json'), cookies, { spaces: 4 });
        browser.close();
        return console.log('done');
    }
    catch (error) {
        console.error(error);
    }
};
