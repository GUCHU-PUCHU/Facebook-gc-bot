# fbBot

FbBot is a simple group chat bot for facebook. (Its pretty much a clone of discordbots but for FB XD).
This bot uses [Unofficial facebook Chat API](https://github.com/Schmavery/facebook-chat-api).

## NOTE 
PLEASE READ THIS. THIS IS IMPORTANT.

You see... This `thing` uses an **Unofficial** Facebook API. This means you need a Burner Facebook account (an account you can easily throw to the bin) or you'll risk your account getting banned.

JUST DON'T USE YOUR REAL FB ACCOUNT. OKAY?. GOOD.


### Dependencies 
***

[NodeJs, npm](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads)


### Installation 
***

```bash
git clone git@github.com:PedjPedj/fbBot.git
cd fbBot
npm i
```

You need to create an .env file. It must be in the root folder. Don't put it inside the /src folder.
The file must be named `.env`. not any other name! Just `.env`.


Paste this:

```txt
EMAIL=user@email.com
PASSWORD=YourPassword
WEATHER_API_KEY=YourWeatherApiKey
```

Put the Email and Password of your burner account.

Get your API key from [Open Weather Map](https://openweathermap.org/api). (optional)

Then run getAppstate.js to fetch the cookies.

```bash
node src/getAppstate.js
```

Before you can use the bot, you need to check the config.json file first.

You can customize the config.json file by editing it.


> **prefix** is the command prefix.

> **botName** is the name of the bot. Please note that botName[0]'s first letter must be capitalized.

> **response** is what the bot replies with if mentioned. You can leave it blank if you want.

> **threadID** is the thread id of the group chat. This one is highly important. It's here so the bot can send and receive messages only to that group chat. You can get the thread id by opening the group chat in facebook and copying the id from the url. *I don't know how sharding works yet so the bot can only work for a single group chat.*


```json
{
    "prefix" : ".",
    "botName" : ["Bot", "bot"],
    "response": [ "response 1", "response 2", "response 3"],
    "threadID": ""
}
```
### Running the bot 

Now, pray to every god that you don't get banned and everything works as intended.
*If you're an atheist.. then that sucks. R'amen, May his noodly goodness touch you!* JKJKJK

Then run the bot.

```bash
node .
```

I'll automate the setup when I get to it. XD
 *tbh I'm not sure if I'll do it or not and I don't know how yet.*