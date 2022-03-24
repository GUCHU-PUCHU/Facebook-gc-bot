var utils = require('../utils');
var config = require('../config.json');
var moment = require('moment');

const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

module.exports = {
	name: 'weather',
	description: 'Displays current weather',
	usage: '[City]',
	adminOnly: false,
	args: false,
	hidden: false,
	cooldown: true,
	async execute(api, message, args) {
		const query = args.slice(0).join(' ');

		if (config.weatherAPIKey === undefined || config.weatherAPIKey === '') {
			utils.noticeReact(api, message.messageID);
			return api.sendMessage(
				'Weather API key is not set!',
				message.threadID
			);
		}
		const response = await fetch(
			`http://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${config.weatherAPIKey}`
		).then((res) => res.json());

		if (!response.id) {
			utils.noticeReact(api, message.messageID);
			return api.sendMessage(
				`${response.cod} : ${response.message}`,
				message.threadID
			);
		}

		utils.successReact(api, message.messageID);

		api.sendMessage(
			`Current weather in ${response.name} is ${response.weather[0].description}\n` +
				`* Temperature: ${response.main.temp}°C\n` +
				`* Feels like: ${response.main.feels_like}°C\n` +
				`* Temp Min: ${response.main.temp_min}°C\n` +
				`* Temp Max: ${response.main.temp_max}°C\n` +
				`* Humidity: ${response.main.humidity}%\n` +
				`* Wind: \n   > Speed: ${response.wind.speed} m/s \n   > Degree: ${response.wind.deg}°\n` +
				`* Sunrise: ${moment
					.unix(response.sys.sunrise)
					.format('h:mm a')}\n` +
				`* Sunset: ${moment
					.unix(response.sys.sunset)
					.format('h:mm a')}\n` +
				`* Coordinates: \n   > Lat: ${response.coord.lat} \n   > Lon: ${response.coord.lon}\n` +
				`* Time of data calculation: ${moment
					.unix(response.dt)
					.format('h:mm a')}`,
			message.threadID
		);
	},
};
