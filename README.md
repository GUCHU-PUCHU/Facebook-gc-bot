<img alt="Facebook-gc-bot-banner" src="https://i.imgur.com/l25Mekd.png">

<h2 align="center"> Hey, It actually works! </h1>

<p align="center">
    <img alt="ViewCount" src="https://views.whatilearened.today/views/github/PedjPedj/Facebook-gc-bot-badge.svg">
    <a href="https://github.com/PedjPedj/Facebook-gc-bot"><img alt="GitHub Clones" src="https://img.shields.io/badge/dynamic/json?color=success&label=Clone&query=count&url=https://github.com/PedjPedj/Facebook-gc-bot/blob/main/clone.json?raw=True&logo=github"></a>
    <a href="https://github.com/PedjPedj/Facebook-gc-bot/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/PedjPedj/Facebook-gc-bot"></a> 
</p>
<p align="center">
    <a href="https://github.com/prettier/prettier"><img alt="Code style: Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge"></a>
    <a href="https://github.com/PedjPedj/Facebook-gc-bot/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/PedjPedj/Facebook-gc-bot?style=for-the-badge"></a>
    <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/pedjpedj/Facebook-gc-bot?style=for-the-badge">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/pedjpedj/Facebook-gc-bot?style=for-the-badge">
</p>

# NOTE

PLEASE READ THIS. THIS IS IMPORTANT.

You see... This `thing` uses an [**Unofficial** Facebook Chat API](https://github.com/Schmavery/facebook-chat-api). This means you need a Burner Facebook account (an account you can easily throw to the bin. Kobe!) or you'll risk your account getting banned.

JUST DON'T USE YOUR REAL FB ACCOUNT. OKAY?. GOOD.

I'm a beginner and I'm still learning, so there might be some bugs... and I'm not sure if I'm doing everything right. anyways, have fun with this bot. If you're looking at the code right now, my apologies.. It might look messy but it works.

## About

This is but a simple bot that can do stuff in your Facebook group chat.

## Features

-   Automate the following:

    -   Listing or recording a lists of things.
    -   Googling stuff. ik not much...

-   Pinning a message.
-   Meme generator
-   Urban dictionary

## TODO

-   [x] Add a pin command.
-   [x] Snipe command.
-   [ ] Add fun stuff. (idk what fun stuff I'll add.)
-   [ ] Give every thread a custom config.
-   [ ] Clean up the code.
-   [ ] I'm out of ideas, please suggest some.

## Dependencies

[NodeJs](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads)

## Installation and Running

I Hope everything here is clear enough and understandable since english is not my first language.

### Step 0: Install the Dependecies

You need to install these things.

[NodeJs](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads)

### Step 1: Clone or download the repository

Either clone it through `git clone https://github.com/PedjPedj/Facebook-gc-bot.git`

or download the **.zip** file then extract it.

<img src="https://i.imgur.com/lSZWsbG.png">

### Step 2: Open the directory

Just open the folder where the files are located.

### Step 3: Run the script

#### Windows

Just open the folder and run the `start.bat` file.

> **Notes:** I'm not sure if this works on windows.

#### Linux

Do `chmod +x start.sh` and then `./start.sh`

Choose '**start**'.
You'll be prompted to setup your bot and Fb account.

Make sure your credentials are **correct**! or else you're most likely to get blocked by Facebook.
If that happened, just open your browser and verify your account.

## Stuff you might want to know

These stuff are all self explanatory but I'll still try to explain them anyway.

-   **Prefix** - The prefix for the bot. This will be used to trigger the bot.

-   **Bot name** - The name of the bot. This is optional. The only thing it does is... if you @mention the bot, it will respond with a message defined by the 'response' in the config.

-   **Response** - The response of the bot if @mentioned.

-   **Thread Id** - The id of your group chat. This can be found in the url of the chat. This is used for locking the bot to a specific chat.

    <img src="https://i.imgur.com/BoPppJW.png">
    <br>

-   **W api key** - This is simply an api key for the weather api. You can get one for free at [openweathermap.org](https://openweathermap.org/api). note that weather command is not implemented yet.

-   **Gc Lock** - This is a boolean value. If it's true, the bot will only respond to the group chat defined by thread id in the config.

-   **Cooldown** - This is the cooldown time in seconds. The bot will not respond to the same command or sender within this time. ( x \* 1000) = seconds of cooldown.

**Imgflip**

-   **Username** - The username of the imgflip account.

-   **Password** - The password of the imgflip account.

# Issues

Sometimes you might get some random errors. Most of the time it's just Facebook blocking you...
open browser then verify account.

Or the bot is not part of any group chat yet... make sure the account you're using is part of a group chat.

If you have any other issues, let me know! Please don't hesitate to [open an issue](https://github.com/PedjPedj/Facebook-gc-bot/issues). I'll try my best to help you.

# Suggestions

If you have any suggestions, please don't hesistate to [open a pull request](https://github.com/PedjPedj/Facebook-gc-bot/pulls). I would love to hear from you and learn.
