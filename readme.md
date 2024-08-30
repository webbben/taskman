# taskmonger

This is a terminal application I made for managing tasks. I like the charm of using terminal applications, and I found out that you can use ink to write react applications in the terminal! It's actually awesome and makes it so much easier and more fun to make tools in the terminal.

### What does the name mean?

It's kind of a bad name to be honest lol.  I was gonna name this "taskman" (task + manager, but shortened), but alas this name is already claimed on npm. So after a bit of looking around for similar words, I came up with "taskmonger".  Ya know, there are _-monger_ words in general like "fishmonger", "warmonger", etc (not a great comparison now that I write it down...), so I thought "taskmonger" was apt!

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
