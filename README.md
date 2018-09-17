# Telk Music Discord.js Music Module
Important Note: This module does not work for discord.js masters as embeds are differnt


__The commands available are:__  
* `play [a url or search string]`: Play a video/music
* `p [a url or search string]`: Play a video/music
* `search [a url or search string]`: making this command a bit different than play command
* `skip [number]`: Skip some number of songs. Will skip 1 song if a number is not specified.
* `queue`: Display the current queue.
* `volume [number]`: Change the volume from 1-200(sometimes the quality is bad)
* `leave`: Clears the song queue and leaves the channel.
* `clearqueue`: Clears the song queue.
* `stop`: Stops the bot from playing music
* `loop [on/off]`: Loops the queue
* `np`: shows the song that is currently playing
* `nowplaying`: shows the song that is currently playing
* `about`: eh. . . u think i don't put a command for credit?
* `lyrics`: shows the current song lyrics

__removed commands__
* `pause`: Pause music playback.
* `resume`: Resume music playback.


# How to use
__npm packages you need__
* `npm install node-opus or npm install opusscript`: yay a voice support npm package lul
* `npm install ytdl-core`: npm package for playing the video
* `npm install telk-music`: why would u read this without downloading the npm package?
* `npm install ffmpeg-binaries`
* `You will also need ffmpeg`

__code example__

```javascript
const Discord = require('discord.js');
const music = require('telk-music');
const client = new Discord.Client();
const token = "<bot_token>" //dont show this to anyone!

client.on('ready', () => {
    console.log(`Music Bot is now ready!`);
});

music(client, {
  apikey: 'ytapikey' //dont show this to anyone!
});
client.login(token);
```

__options__
Name | type | example
* `apikey`: string | 'google api key'
* `prefix`: string | '-'
* `maxQueueSize`: init | 100 (0 is unlimited)
* `deletemsg`: true/false | false
* `play_is_search`: true/false | true
* `messages`: all strings 
  - search | ':mag_right: **Searching**  \`{song}\` . . .'
  - added | ':musical_note: Added **{song}** to the queue!'
  - play | ':notes: Now Playing **{song}**!'
  - loop | ':white_check_mark: loop turned **{toggle}**!'
  - end_of_queue | ':white_check_mark: We ran out of songs.'
  - channelerror | ':x: Sorry but you cannot use `{command}` in dms'
* `emotes`: all strings
  - x | ':x:'
  - check | ':white_check_mark:'
  - mag | ':mag_right:'
* `othercmds`: true/false | true


__Extra Information__
* by telk
* music commands are disabled in dms!
* lyric command now works better
* doesnt response to other bots
* add me on discord Telk#7197
* need help? join https://discord.gg/3FKGeFw
