# Telk Music Discord.js Music Module
Important Note: This module does not work for discord.js masters as embeds are differnt


__The commands available are:__  
* `play [a url or search string]`: Play a video/music
* `p [a url or search string]`: Play a video/music
* `search [a url or search string]`: making this command a bit different than play command
* `skip [number]`: Skip some number of songs. Will skip 1 song if a number is not specified.
* `queue`: Display the current queue.
* `volume [number]`: Change the volume from 1-200(sometimes the quality is bad)
* `clearqueue`: Clears the song queue.
* `stop`: Stops the bot from playing music
* `loop [on/off]`: Loops the queue
* `np`: shows the song that is currently playing
* `nowplaying`: shows the song that is currently playing
* `lyrics`: shows the current song lyrics
* `pause`: Pause music playback.
* `resume`: Resume music playback.

__other commands__
this option with only work when the other commands option is on
* `ping`: sends the ping of the bot
* `help`: sends the command list
* `stats`: sends some stats of the bot
* `about`: sends information about the bot

__removed commands__
* `leave`: Clears the song queue and leaves the channel.
Reason: clearqueue is the same and leave clears the queue which idk(i dont think dis command is necessary)


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

 Name | Info | Type | Example 
| --- | ----- | --- | ---- |
apikey | google api key | string | 'google api key'
prefix | the bots prefix(supporting per guild prefix soon™) |  string | '-'
maxQueueSize | set the max queue size(0 is unlimited) | init | 100
deletemsg | if the bot should delete messages or not | true/false | false
play_is_search | should the play command allow you to have a song selection or auto select | true/false | true
messages | set custom messages | object | {search: ':mag_right: **Searching**  \`{song}\` . . .', added: '':musical_note:  Added **{song}** to the queue!', play: ':notes: Now Playing **{song}**!', loop: ':white_check_mark: loop turned **{toggle}**!', end_of_queue: ':white_check_mark: We ran out of songs.', channelerror: ':x: Sorry but you cannot use `{command}` in dms'}
emotes | set the custom emotes | object | {x: ':x:', check: ':white_check_mark:', mag: ':mag_right:'}
othercmds | if the bot should have other commands | true/false | true

**Notes:** in the messages section you can edit the end_of_queue to 'off' to make it not send a message at the end of the queue. only the apikey option is the one that is important the rest is optional


__Extra Information__
* by telk
* music commands are disabled in dms!
* lyric command now works better
* doesnt response to other bots
* need help? join https://discord.gg/3FKGeFw
