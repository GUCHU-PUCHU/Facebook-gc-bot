const utils = require('../utils');
const config = require('../config.json');

const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
require('dotenv').config();

module.exports = {
    name: 'weather',
    description: 'Displays current weather',
    usage: '[City]',
    adminOnly: false,
    args: true,
    async execute(api, message, args) {
        let data = [];
        const query = args.slice(0).join(' ');

        if (config.weatherAPIKey === undefined || config.weatherAPIKey === '') {
            utils.noticeReact(api, message.messageID);
            return api.sendMessage('Weather API key is not set!', message.threadID);
        }
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${process.env.WEATHER_API_KEY}`).then(res => res.json());

        if (response.cod === '404') {
            utils.noticeReact(api, message.messageID);
            return api.sendMessage('City not found!', message.threadID);
        }
        
        else {
            utils.successReact(api, message.messageID);
            data.push(`Current weather in ${response.name} is ${response.weather[0].description}`);
            data.push(`Temperature: ${response.main.temp}°C`);
            data.push(`Feels like: ${response.main.feels_like}°C`);
            data.push(`Temp Min: ${response.main.temp_min}°C`);
            data.push(`Temp Max: ${response.main.temp_max}°C`);
            data.push(`Humidity: ${response.main.humidity}%`);
            data.push(`Wind: ${response.wind.speed} m/s`);
            api.sendMessage(data.join('\n'), message.threadID);
        }
    },
};