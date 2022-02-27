const log = require('npmlog');

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
    }
    

}