# fbBot
FbBot is a simple group chat for facebook. 
This bot uses [Unofficial facebook Chat API](https://github.com/Schmavery/facebook-chat-api).

## Installation

```bash
git clone git@github.com:PedjPedj/fbBot.git
cd fbBot
npm i
```
You need to create and .env file inside the /src folder.

Paste this:
```txt
EMAIL=user@email.com
PASSWORD=YourPassword
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


