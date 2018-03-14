# Discord.js Music

__The commands available are:__  
* `play [a url or search string]`: Play a video/music
* `p [a url or search string]`: Play a video/music
* `search [a url or search string]`: making this command a bit different than play command
* `skip [number]`: Skip some number of songs. Will skip 1 song if a number is not specified.
* `queue`: Display the current queue.
* `pause`: Pause music playback.
* `resume`: Resume music playback.
* `volume [number]`: Change the volume from 1-200(sometimes the quality is bad)
* `leave`: Clears the song queue and leaves the channel.
* `clearqueue`: Clears the song queue.
* `stop`: Stops the bot from playing music
* `loop [on/off]`: Loops the queue
* `np`: shows the song that is currently playing
* `nowplaying`: shows the song that is currently playing
* `about`: eh. . . u think i don't put a command for credit?
* `lyrics`: shows the current song lyrics


# How to use
__npm packages you need__
* `npm install node-opus or npm install opusscript`: yay a voice support npm package lul
* `npm install ytdl-core`: npm package for playing the video
* `npm install youtube-search`: an npm package for. . . searching using strings
* `npm install telk-music`: why would u read this without downloading the npm package?
* `npm install ffmpeg-binaries`

__code example__
For lazy people. . .
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

Change the prefix and stuff
```javascript
const Discord = require('discord.js');
const music = require('telk-music');
const client = new Discord.Client();
const token = "<bot_token>"  //dont show this to anyone!

client.on('ready', () => {
    console.log(`Music Bot is now ready!`);
});

music(client, {
  apikey: 'ytapikey', //dont show this to anyone!
	prefix: '?',
	global: false,
	maxQueueSize: 100,
	deletemsg: false
});
client.login(token);
```

The full usage of the module. . .
```javascript
const Discord = require('discord.js');
const music = require('telk-music');
const client = new Discord.Client();
const token = "<bot_token>"  //dont show this to anyone!

client.on('ready', () => {
    console.log(`Music Bot is now ready!`);
});

music(client, {
  apikey: 'ytapikey', //dont show this to anyone!
	prefix: '-',
	global: false,
	maxQueueSize: 100,
	deletemsg: false,
  searchmsg: 'FINDING \`{song}\` . . . please wait',
  addedmsg: 'I HAVE Added **{song}** to the queue!',
  playmsg: ':notes: Dont rage. . . im now playing **{song}**!',
  loopmsg: 'LOOOP has been turned **{toggle}**!'
});
client.login(token);
```


__Extra Information__
* by telk
* music commands are disabled in dms!
* lyrics command works! don't ask how i made it lul
