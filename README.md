# fbBot

FbBot is a simple group chat bot for facebook. (Its pretty much a clone of discordbots but for FB XD).
This bot uses [Unofficial facebook Chat API](https://github.com/Schmavery/facebook-chat-api).

## NOTE 
PLEASE READ THIS. THIS IS IMPORTANT.

You see... This `thing` uses an **Unofficial** Facebook API. This means you need a Burner Facebook account (an account you can easily throw to the bin. Kobe!) or you'll risk your account getting banned.

JUST DON'T USE YOUR REAL FB ACCOUNT. OKAY?. GOOD.

> I'm a beginner and I'm still learning, so there might be some bugs... and I'm not sure if I'm doing everything right. anyways, have fun with this bot.


### Dependencies 
***

[NodeJs, npm](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads)


### Installation 
***

> Hope everything here is clear enough and understandable since english is not my first language.

Clone the repo and run `npm install` in the root directory.

```bash
git clone https://github.com/PedjPedj/fbBot.git
cd fbBot
npm i
```
then run the setup script.

```bash
node setup --login
```
You'll be prompted to login to your FB account. Note: You need to use a burner account.

```bash
node setup --config
```
You'll be prompted to enter the configuration for the bot.

> **prefix** is the command prefix. it can be a single character or more. This is the "trigger" for the bot.

> **botName** is the name of the bot. to trigger @botName.

> **response** is the response to the bot when called. (optional)

> **threadID** is the thread ID of the chat. (**IMPORTANT**) You can get this from the url of the chat group.

> **weather API Key** is the API key for the weather API. Get your API key from [Open Weather Map](https://openweathermap.org/api). (optional)


### Running the bot 
***

Now, pray to every god that you don't get banned and everything works as intended.
*If you're an atheist.. then that sucks. R'amen, May his noodly goodness touch you!* JKJKJK

Then run the bot.

```bash
node .
```