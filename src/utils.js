const fs = require('fs-extra');
const log = require('npmlog');
const puppeteer = require('puppeteer');

module.exports = {

    // Reactions for the bot
    successReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
            api.setMessageReaction('✅', msgId);
        });
    },

    errorReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
            api.setMessageReaction('❌', msgId);
        });
    },

    dislikeReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
            api.setMessageReaction('👎', msgId);
        });
    },

    likeReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
            api.setMessageReaction('👍', msgId);
        });
    },

    lookReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
            api.setMessageReaction('🔍', msgId);
        });
    },

    eyesReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
            api.setMessageReaction('👀', msgId);
        });
    },

    noticeReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
            api.setMessageReaction('❗', msgId);
        });
    },

    sadReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
            api.setMessageReaction('😢', msgId);
        });
    },

    emptyReact: function (api, msgId) {
        api.setMessageReaction('', msgId, (err) => {
            if (err) return log.error(err);
        });
    },

    numberBulletGiver: function (arr) {
        let txtArr = [];
        for (let i = 0; i < arr.length; i++) {
            txtArr.push((i + 1) + '. ' + arr[i]);
        }
        return txtArr.join('\n');
    },

    // Returns a random number between min (inclusive) and max (exclusive)
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    // Returns a random element from an array
    getRandomElement: function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    trim: function (str, max) {
        return (str.length > max) ? str.substr(0, max - 3) + '...' : str;
    },

    // Function that split a message into chunks of max length
    splitMessage: function (message, maxLength) {
        if (message.length <= maxLength) return [message];

        const split = message.split(' ');
        const result = [];
        let tempMsg = '';

        for (let i = 0; i < split.length; i++) {
            if (tempMsg.length + split[i].length < maxLength) {
                tempMsg += `${split[i]} `;
            } else {
                result.push(tempMsg);
                tempMsg = '';
                i--;
            }
        }
        result.push(tempMsg);

        return result;
    },

    fetchCookie: async function (email, password) {
        if (email === undefined || password === undefined) {
            return log.error('Please provide an email and password');
        }

        if (email.length < 1 || password.length < 1) {
            return log.error('Please provide an email and password');
        }

        if (!fs.existsSync(__dirname + '/data/fbCookies.json')) {
            fs.ensureFileSync(__dirname + '/data/fbCookies.json');
            log.info('cookies', 'Created fb_cookies.json');
        }

        try {
            log.info('cookies', 'Attempting to launch browser...');
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(60000);
            await page.goto(`https://www.facebook.com/`);
            await page.waitForSelector('#email');
            try {
                await page.type(`#email`, email);
            } catch (err) {
                return log.error('cookies', 'Error typing email');
            }

            try {
                await page.type(`#pass`, password);
            } catch (err) {
                return log.error('cookies', 'Error typing password');
            }

            log.info('cookies', 'Credentials entered, attempting to login...');
            await page.click('[type="submit"]');
            await page.waitForNavigation();
            try {
                await page.click('div');

            } catch (error) {
                return log.error('cookies', 'error logging in. Check your credentials.');
            }

            cookies = await page.cookies();
            cookies = cookies.map(({
                    name: key,
                    ...rest
            }) => ({
                    key,
                    ...rest
            }));
            fs.writeFileSync(__dirname + '/data/fbCookies.json', JSON.stringify(cookies));
            log.info('cookies', 'Cookies saved!');
            await browser.close();
        } catch (err) {
            log.error('cookies', 'Error:', err);
            return;
        }

    }

}