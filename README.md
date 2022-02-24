# fbBot

FbBot is a simple group chat for facebook. (Its pretty much a clone of discordbots but for FB XD).
This bot uses [Unofficial facebook Chat API](https://github.com/Schmavery/facebook-chat-api).

# NOTE
PLEASE READ THIS. THIS IS IMPORTANT.

You see... This `thing` uses an unofficial Facebook API. This means you need a Burner Facebook account (an account you can easily throw away) or you'll risk your account getting banned.

DON'T USE YOUR REAL FB ACCOUNT. OKAY?. GOOD.

## Dependencies

[NodeJs](https://nodejs.org/en/download/)

[Git](https://git-scm.com/downloads)

## Installation

```bash
git clone git@github.com:PedjPedj/fbBot.git
cd fbBot
npm i
```

You need to create an .env file. It must be in the root folder. Don't put it inside the /src folder.

Get your API key from [Open Weather Map](https://openweathermap.org/api).

Paste this:

```txt
EMAIL=user@email.com
PASSWORD=YourPassword
WEATHER_API_KEY=YourWeatherApiKey
```

Put your email and password.

Then run getAppstate.js to fetch the cookies.

```bash
node src/getAppstate.js
```

Then run the bot.

```bash
node .
```

you can change the prefix other settings of the bot in the config.json file.

I'll automate the setup when I get to it. XD
