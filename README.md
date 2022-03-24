<p align="center">
    <img alt="ViewCount" src="https://views.whatilearened.today/views/github/PedjPedj/Facebook-gc-bot-badge.svg">
    <a href="https://github.com/PedjPedj/Facebook-gc-bot"><img alt="GitHub Clones" src="https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=count&url=https://github.com/PedjPedj/Facebook-gc-bot/blob/main/clone.json?raw=True&logo=github"></a>
</p>


# Facebook-gc-bot

Facebook-gc-bot is a simple group chat bot for facebook. (Its pretty much a clone of discordbots but for FB XD).
This bot uses [Unofficial facebook Chat API](https://github.com/Schmavery/facebook-chat-api).

## NOTE

PLEASE READ THIS. THIS IS IMPORTANT.

You see... This `thing` uses an **Unofficial** Facebook API. This means you need a Burner Facebook account (an account you can easily throw to the bin. Kobe!) or you'll risk your account getting banned.

JUST DON'T USE YOUR REAL FB ACCOUNT. OKAY?. GOOD.

> I'm a beginner and I'm still learning, so there might be some bugs... and I'm not sure if I'm doing everything right. anyways, have fun with this bot. you're looking at the code right now, my apologies.. It might look messy but it works.

### Dependencies

***

[NodeJs](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads)

### Installation

***

> Hope everything here is clear enough and understandable since english is not my first language.

Clone the repo and run `npm install` in the root directory.

```bash
git clone https://github.com/PedjPedj/Facebook-gc-bot.git
cd Facebook-gc-bot
npm i
```

then run the setup script.

```bash
npm run setup
```

Choose `login` to enter your credentials. Then you'll be asked if you want to setup your configuration files, enter 'y' to initialize the files.

> **Prefix** is the command prefix. it can be a single character or more. This is the "trigger" for the bot.
>
> **Bot name** is the name of the bot. to trigger @botName.
>
> **response** is the response of the bot when mentioned @botName. (optional)
>
> **Thread ID** is the thread ID of the chat. (**IMPORTANT**) You can get this from the url of the chat group.
>
> **Weather API Key** is the API key for the weather API. Get your API key from [Open Weather Map](https://openweathermap.org/api). (optional)
>
> **GC Lock** is the group chat lock. If you want to prevent the bot from receiving messages from other group chat, set this to true.

### Running the bot

***

Now, pray to every god that you don't get banned and everything works as intended.
*If you're an atheist.. then that sucks. R'amen, May his noodly goodness touch you!* JKJKJK

Then run the bot.

```bash
npm start
```
