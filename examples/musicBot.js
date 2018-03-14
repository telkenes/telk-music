const Discord = require('discord.js');
const music = require('telk-music');
const client = new Discord.Client();
const token = "<bot_token>" //dont show this to anyone!

client.on('ready', () => {
    console.log(`Music Bot is now ready!`);
});

music(client, {
    apikey: 'ytapikey', //dont show this to anyone!
    prefix: '-',
    global: false,
    maxQueueSize: 10,
    clearInvoker: false
});
client.login(token);
