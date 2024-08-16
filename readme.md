# taskmonger

This is a terminal application I made for managing tasks. I like the charm of using terminal applications, and I found out that you can use ink to write react applications in the terminal! It's actually awesome and makes it so much easier and more fun to make tools in the terminal.

### What does the name mean?

_Originally_ this was supposed to be called taskman. like task manager, but shortened. But alas, that name was taken on NPM, so I couldn't publish it. So I changed it slightly to be "taskmonger". 
Ya know, like other "monger" words: fishmonger, warmonger, etc. [The definition of monger is: "broker; dealer; peddler"](https://www.merriam-webster.com/dictionary/monger) - as in a dealer or merchant of a certain type of goods.
Anyway, the word just sounds funny too, doesn't it? That's mainly why I chose it - _monger_, hah! So, if you really stretch the meaning it almost sorta makes sense. An app for dealing tasks? A task brokerage?

### Future plans:

- make a CLI to enable adding, completing, modifying (etc) tasks from the command line, without needing to actually use this application's UI. Would enable external scripting, and allow you to "jot down" simple tasks from the command line.

## Install

```bash
npm install --global taskmonger
```

## Usage

To use, simply enter `taskmonger` in your terminal to launch the application. You can enter Escape at any time to leave the application.

## Uninstall

use the usual npm commands to uninstall:

```shell
npm uninstall -g taskmonger
```

However, note that this application stores its app data (i.e. saved task data) to your disk in the usual app data path for your OS.
The data will be saved in a folder called `taskman` (this app was originally called this until I realized the name is taken on npm).

```shell
# MacOS
cd ~/Library/Application\ Support/taskman

# Windows
cd %APPDATA%\taskman
```
