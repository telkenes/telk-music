const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const search = require('./yt-search/index.js');
const fetch = require('node-fetch')
module.exports = function (client, options) {
	var prefix = (options && options.prefix) || '!', //! is a dumb prefix dont use it kthx
    max_queue_size = (options && options.maxQueueSize) || 100, //max queue size, if 0 means unlimited
	timelimit = (options && options.timelimit) || true, //filters 1h songs out
	delete_msg = (options && options.deletemsg) || false, //delete the msgs
	play_is_search = (options && options.play_is_search) || false //if the play command should give options to pick
	//others
	api_key = (options && options.apikey) || "oooof why are u trying to think ill give u a key",
	othercmds = (options && options.othercmds) || false,
	//custom msgs
	searchmessage = (options.messages && options.messages.search) || ':mag_right: **Searching**  \`{song}\` . . .', 
	addedmessage = (options.messages && options.messages.added) || ':musical_note: Added **{song}** to the queue!',
	playmessage = (options.messages && options.messages.play) || ':notes: Now Playing **{song}**!',
	loopmessage = (options.messages && options.messages.loop) || ':white_check_mark: loop turned **{toggle}**!',
	sorrymsg = (options.messages && options.messages.channelerror) || ':x: Sorry but you cannot use `{command}` in dms',
	no_more_songs_message = (options.messages && options.messages.end_of_queue) || ':white_check_mark: We ran out of songs.',
	//emotes
	x = (options.emotes && options.emotes.x) || ':x:'
	check = (options.emotes && options.emotes.check) || ':white_check_mark:'
	mag = (options.emotes && options.emotes.mag) || ':mag_right:'
	if (!api_key || api_key.length < 10) return console.log("\"No U\" pls insert a valid API key")

	let queues = {};
	var guildoptions = {};

var parseTime = function(milliseconds) {
	var seconds = Math.floor(milliseconds/1000); milliseconds %= 1000;
	var minutes = Math.floor(seconds/60); seconds %= 60;
	var hours = Math.floor(minutes/60); minutes %= 60;
	var days = Math.floor(hours/24); hours %= 24;
	var written = false;
	return (days?(written=true,days+" days"):"")+(written?", ":"")
		+(hours?(written=true,hours+" hours"):"")+(written?", ":"")
		+(minutes?(written=true,minutes+" minutes"):"")+(written?", ":"")
		+(seconds?(written=true,seconds+" seconds"):"")+(written?", ":"")
		+(milliseconds?milliseconds+" milliseconds":"");
  };

client.on('message', async (msg) => {
	run(msg)
})

client.on('messageUpdate', async (oldmsg, newmsg) => {
	run(newmsg)
})

client.on('messageDelete', async (msg) => {
	const queue = getQueue(msg.guild.id)
	if (queue.npmsgid === msg.id) {
		clearInterval(queue.editmsg)
		queue.npmsgid = null
		queue.npmsg = null
	}
})

		async function run(msg) {
		const message = msg.content.trim();
		if (msg.author.bot) return;
		if (message.toLowerCase().startsWith(prefix.toLowerCase())) {
			const command = message.substring(prefix.length).split(/[ \n]/)[0].toLowerCase().trim();
			const suffix = message.substring(prefix.length + command.length).trim();
			if(msg.channel.type === 'text') {
			if (!guildoptions[msg.guild.id]) guildoptions[msg.guild.id] = {
			  loop: 0,
				volume: 50,
			}
			}
			switch (command) {
                        //just cmds for nubs
        case "ping":
        if (othercmds === false) return
        var ping = await msg.channel.send("Pinging...")
        ping.edit(`:ping_pong: Pong! ${ping.createdTimestamp - msg.createdTimestamp}ms`)
        break;
        case "about":
        if (othercmds === false) return
		var aboutembed = new Discord.RichEmbed().setTitle('About')
		.setDescription('This bot is coded using discord.js and is currently using Telk\'s Music Module named telk-music. More info is [Here](https://www.npmjs.com/package/telk-music)')
		msg.channel.send(aboutembed)
        break;
        case "help":
        if (othercmds === false) return
		var helpembed = new Discord.RichEmbed().setTitle('Command List:').setDescription(`
		**•** ${prefix}help - shows this message
		\n**•** ${prefix}ping - shows the bot ping
		\n**•** ${prefix}stats - shows the bot stats
		\n**•** ${prefix}play - add a song to the queue
		\n**•** ${prefix}search - gives a song selection and adds that song to the queue 
		\n**•** ${prefix}skip - skips the current song playing
		\n**•** ${prefix}queue - shows the queued songs
		\n**•** ${prefix}volume - change the volume of the playback
		\n**•** ${prefix}pause - pauses the playback
		\n**•** ${prefix}resume - resumes the playback
		\n**•** ${prefix}stop - stops the playback and leaves the voicechannel
		\n**•** ${prefix}loop - turning loop on/off
		\n**•** ${prefix}np - shows the nowplaying song can also works with ${prefix}nowplaying\n\n[Music Module by Telk#7197](https://npmjs.org/package/telk-music)`)
        msg.channel.send(helpembed).setColor(0x009cf7);
        break;
        case "stats":
		if (othercmds === false) return
		var statsembed = new Discord.RichEmbed()
.setTitle(`Bot Stats:`)
.setDescription(`**•** Prefix: ${prefix}\n**•** Coded using: discord.js\n**•** Up Time: ${parseTime(client.uptime)}\n**•** Servers: ${client.guilds.array().length}\n**•** Users: ${client.users.size} users\n**•** Status: Online`)
.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL)
.setColor(0x009cf7);
message.channel.send(statsembed);
        break;
        
				case 'play':
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
					if (play_is_search === false) return play(msg, suffix);
					if (play_is_search === true) return searchsong(msg, suffix);
					break;
				case 'p':
					if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
						if (play_is_search === false) return play(msg, suffix);
						if (play_is_search === true) return searchsong(msg, suffix);
						break;
				case 'search':
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
					searchsong(msg, suffix);
					break;
				case 'skip':
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
					skip(msg, suffix);
					break;
				case 'queue':
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
					queue(msg, suffix);
					break;
				case 'volume':
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
					volume(msg, suffix);
					break;
				case 'stop':
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
					clearqueue(msg, suffix);
					break;
				case 'clearqueue':
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
					clearqueue(msg, suffix);
					break;
				case "loop":
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
					loop(msg, suffix);
					break;
				case "nowplaying":
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
				np(msg)
				break;
				case "np":
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
				np(msg)
				break;
				case "about":
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
				about(msg)
				break;
				case "lyrics":
				if(msg.channel.type === 'dm') return msg.channel.send(`${x} Sorry, \`' ${command}  \` command can only be used in a guild/server`)
				lyric(msg, suffix)
				break;
				case 'pause':
				if(msg.channel.type === 'dm') return msg.channel.send(':x: Sorry, \`' + command + ' \` command can only be used in a guild/server')
					pause(msg, suffix);
					break;
				case 'resume':
				if(msg.channel.type === 'dm') return msg.channel.send(':x: Sorry, \`' + command + ' \` command can only be used in a guild/server')
					resume(msg, suffix);
					break;
			}
			if (delete_msg) {
				msg.delete();
			}
		}
	}




	//perm checking and getting queue
	function isAdmin(member) {
		return member.hasPermission("ADMINISTRATOR");
	}

	function canSkip(member, queue) {
		if (queue[0].requester === member.id) return true;
		else if (isAdmin(member)) return true;
		else return false;
	}


	function getQueue(server) {
		if (!queues[server]) queues[server] = [];
		return queues[server];
	}

	//now playing
async function np(msg) {
		const queue = getQueue(msg.guild.id);
		if (!queue[0]) return msg.channel.send(`${x} No music being played.`)
		if (!queue.nplength) return msg.channel.send(`${x} No music being played.`)
        var timeline = timebar(queue.runningtime, queue.nplength)
        let cmin = Math.floor(queue.runningtime / 60);
        let csec = queue.runningtime - cmin * 60;
        let c = `${cmin}: ${csec}`.split(' ')
        if (c[1].length === 1) c[1] = '0' + c[1]
        if (cmin.length === 1) c[0] = '0' + c[0]
        if (cmin.length === 0) c[0] = '00' + c[0]
        let npmin = Math.floor(queue.nplength/60);
        let npsec = queue.nplength - npmin * 60
        let np = `${npmin}: ${npsec}`.split(' ')
        if (np[1].length === 1) np[1] = '0' + np[1]
        if (npmin.length === 1) np[0] = '0' + np[0]
        var nowplayingembed = new Discord.RichEmbed()
        .setTitle('Now Playing:').setDescription(`**${queue[0].title}**\n${c.join('')} ${timeline} ${np.join('')}`)
        queue.npmsg = await msg.channel.send(nowplayingembed)
	queue.npmsgid = queue.npmsg.id
      	queue.editmsg =  setInterval(() => {
		   if (!queue[0]) return clearInterval(queue.editmsg) 

           if (queue.runningtime >= queue.nplength) {
			var timeline = timebar(queue.nplength, queue.nplength)
			var editplayingembed = new Discord.RichEmbed()
			.setTitle('Now Playing:').setDescription(`**${queue[0].title}**\n${np.join('')} ${timeline} ${np.join('')}`)
			queue.npmsg.edit(editplayingembed).catch(e => {})
			clearInterval(queue.editmsg)
			return
		   }

        var timeline = timebar(queue.runningtime, queue.nplength)
        let cmin = Math.floor(queue.runningtime / 60);
        let csec = queue.runningtime - cmin * 60;
        let c = `${cmin}: ${csec}`.split(' ')
        if (c[1].length === 1) c[1] = '0' + c[1]
        if (cmin.length === 1) c[0] = '0' + c[0]
        if (cmin.length === 0) c[0] = '00' + c[0]
        var editplayingembed = new Discord.RichEmbed()
        .setTitle('Now Playing:').setDescription(`**${queue[0].title}**\n${c.join('')} ${timeline} ${np.join('')}`)
        queue.npmsg.edit(editplayingembed)
       }, 5000)
       
    }

    function timebar(currenttime, maxtime) {
        var max = 30;
        var result = "[";
        var bar = Math.floor(currenttime/~~(maxtime/30))
        if (bar > 30) bar = 30
        for (var i = 0; i < bar; i++) {
            result = result + "─"
        }
        result += "](https://dont.click)" 
        for (var i = 0; i < 30 - bar; i++) {
            result = result + "─"
        }
        return result;
    }

	//play and search cmds
	function play(msg, suffix) {
		if (msg.member.voiceChannel === undefined) return msg.channel.send(`${x} You\'re not in a voice channel.`);

		if (!suffix) return msg.channel.send(`${x} Please provide a link/title of a song for me to play`);

		const queue = getQueue(msg.guild.id);
		if (queue.length >= max_queue_size && max_queue_size >= 1) {
			return msg.channel.send('Maximum queue size reached!');
		}
var searchmsg = searchmessage.replace("{song}", `${suffix}`)
		msg.channel.send(searchmsg).then(response => {
			var searchstring = suffix

			let opts = {
				key: api_key,
			}
			search(searchstring, opts, (err, results) => {
					if(err) {
						response.edit(`${x} Invalid Song title/link`)
					console.log(err);
					return
				} else {
					if (timelimit) {
						ytdl.getInfo(results[0].link, function(err, info) {
					if (info.length_seconds >= 3600) return response.edit(`${x} Sorry but you only cannot queue songs longer than 1 hour`)
					var addedmsg = addedmessage.replace("{song}", `${results[0].title}`)
					results[0].requester = msg.author.id;
					response.edit(addedmsg).then(() => {
						queue.push(results[0])
						if (queue.length === 1) executeQueue(msg, queue);
					})
})
} else {
	var addedmsg = addedmessage.replace("{song}", `${results[0].title}`)
	results[0].requester = msg.author.id;
	response.edit(addedmsg).then(() => {
		queue.push(results[0])
		if (queue.length === 1) executeQueue(msg, queue);
	})
}
				}
				})
	})
}

async function searchsong(msg, suffix) {
	if (msg.member.voiceChannel === undefined) return msg.channel.send(`${x} You\'re not in a voice channel.`);

	if (!suffix) return msg.channel.send(`${x} Please provide a link/title of a song for me to play`);

	const queue = getQueue(msg.guild.id);
	if (queue.length >= max_queue_size) {
		return msg.channel.send('Maximum queue size reached!');
	}

	var searchmsg = searchmessage.replace("{song}", `${suffix}`)
		msg.channel.send(searchmsg).then(response => {
			var searchstring = suffix

			let opts = {
				key: api_key,
				maxResults: 10,
			}
			search(searchstring, opts, (err, results) => {
					if(err) {
						response.edit(`${x} Invalid Song title/link`)
					return
				} else {
					var index = 0;
					var addedmsg = `**Song selection:**\n${results.map(result => `**${++index} -** ${result.title}`).join('\n')}
					\nPlease provide a value to select one of the search results ranging from 1-10.`
					response.edit(addedmsg).then(message => {
						message.channel.awaitMessages(response => response.content > 0 && response.content < 11, {
						  max: 1,
						  time: 10000,
						  errors: ['time'],
						})
						.then((collected) => {
							var number = collected.first().content -1
							results[number].requester = message.author.id;
							queue.push(results[number])
							var addedmsg = 	addedmessage.replace("{song}", `${results[number].title}`)
							message.channel.send(addedmsg);
							if (queue.length === 1) executeQueue(msg, queue);
						  })
						  .catch(() => {
							message.channel.send(`${x} No Song was chosen, selection has been cancelled`);
						  });
					  });
}
			})
		})
		}

		//skip, volume, lyrics
	function skip(msg, suffix) {
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`${x} No music being played.`);

		const queue = getQueue(msg.guild.id);

		if (!canSkip(msg.member, queue)) return msg.channel.send(`${x} You cannot skip this as you didn\'t queue it.`).then((response) => {
			response.delete(5000);
		});
		msg.channel.send('Skipped **' + queue[0].title + '**!');
		queue.splice(0, 0);

		const dispatcher = voiceConnection.player.dispatcher;
		if (voiceConnection.paused) dispatcher.resume();
		dispatcher.end();

	}

	function volume(msg, suffix) {
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`${x} No music being played.`);

		if (!isAdmin(msg.member))
			return msg.channel.send(`${x} You don\'t have permission to use that command!`);

		const dispatcher = voiceConnection.player.dispatcher;
		if (!suffix) return msg.channel.send(`${x} Volume can only be set from 1-200`);
		if (suffix > 200 || suffix < 0) return msg.channel.send(`${x} Volume can only be set from 1-200`).then((response) => {
			response.delete(5000);
		});
		guildoptions[msg.guild.id].volume=suffix
		msg.channel.send(`${check} Volume set to ${suffix}`);
		dispatcher.setVolume((suffix/100));
	}

	async function lyric(msg, suffix) {
		const queue = getQueue(msg.guild.id);
		var message = await msg.channel.send(`${mag} Searching. . .`)
		//pls donate i need a better link
		if (suffix) {
			var res = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(suffix)}`)
			var lyrics = await res.json()
			if (lyrics.error) return message.edit(':frowning: Sorry I could not find that song')
			if (lyrics.lyrics.length >= 2048) {
				var cut = lyrics.lyrics.length - 2000
				lyrics.lyrics = lyrics.lyrics.slice(0,0 - cut) + "..."
				}
			var lyricembed = new Discord.RichEmbed()
			.setTitle(lyrics.title + " lyrics")
			.setDescription(lyrics.lyrics)
			message.edit(lyricembed) 
	} else {
		if (!queue[0]) return message.edit(`${x} No Music is being played.`)
		var res = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(queue[0].title)}`)
		var lyrics = await res.json()
		if (lyrics.error) return message.edit(':frowning: Sorry I could not find that song')
		if (lyrics.lyrics.length >= 2048) {
			var cut = lyrics.lyrics.length - 2000
			lyrics.lyrics = lyrics.lyrics.slice(0,-cut) + "..."
			}
		var lyricembed = new Discord.RichEmbed()
		.setTitle(lyrics.title + " lyrics")
		.setDescription(lyrics.lyrics)
		message.edit(lyricembed)
	}

	}

	//pause, resume, queue

	function pause(msg, suffix) {
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`${x} No music being played.`);
		var queue = getQueue(msg.guild.id)
		if (!queue[0]) return msg.channel.send(`${x} No music being played.`);
		if (!isAdmin(msg.member)) return msg.channel.send(`${x} Sorry you do not have the permission to use this command`);
		const dispatcher = voiceConnection.player.dispatcher;
		if (dispatcher.paused) return msg.channel.send(`${x} Playback is already paused.`);
		msg.channel.send(`${check} Playback paused.`);
		if (!dispatcher.paused) dispatcher.pause();
	}	
	function resume(msg, suffix) {
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(`${x} No music being played.`);
		var queue = getQueue(msg.guild.id)
		if (!queue[0]) return msg.channel.send(`${x} No music being played.`);
		if (!isAdmin(msg.member)) return msg.channel.send(`${x} Sorry you do not have the permission to use this command`);
		const dispatcher = voiceConnection.player.dispatcher;
		if (!dispatcher.paused) return msg.channel.send(`${x} Playback is already paused.`);
		msg.channel.send('Playback resumed.');
		if (dispatcher.paused) dispatcher.resume();
	}

	function queue(msg, suffix) {
        const queue = getQueue(msg.guild.id);
        if (!queue[0]) return msg.channel.send(`${x} No Music is being played`)
		const text = queue.map((video, index) => (
			`**${(index + 1)}**. [${video.title}](${video.link})`
		)).slice(0, 9).join('\n');


		let queueStatus = ':stop_button: Stopped';
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection !== null) {
			const dispatcher = voiceConnection.player.dispatcher;
			queueStatus = dispatcher.paused ? ':pause_button: Paused' : 'Playing \\🎶';
		}
var queueembed = new Discord.RichEmbed()
.setTitle("**Queue** - " + queueStatus)
.setDescription(text)
		msg.channel.send(queueembed);
	}

	function clearqueue(msg, suffix) {
		if (isAdmin(msg.member)) {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.send(`${x} I\'m not in any channel!.`);
			guildoptions[msg.guild.id].loop=0;
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);
			clearInterval(queue.runningInt)
			voiceConnection.disconnect();
			clearInterval(queue.checkvc)
			msg.channel.send(`${check} Music has been stopped`)
		} else if(msg.member.voiceChannel.members.map(u => u.user).length === 2) {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.send(`${x} I\'m not in any channel!.`);
			msg.channel.send(`${check} Music has been stopped`)
			guildoptions[msg.guild.id].loop=0;
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);
			clearInterval(queue.runningInt)
			clearInterval(queue.checkvc)

			voiceConnection.disconnect();	
		} else {
			msg.channel.send(`${x} You don\'t have permission to use this command!`);
		}
	}



	function loop(msg, suffix) {
		if (suffix === "on") {
			var loopmsg = loopmessage.replace("{toggle}", `${suffix}`)
			msg.channel.send(loopmsg)
			guildoptions[msg.guild.id].loop=1;
		} else if (suffix === "off") {
			var loopmsg = loopmessage.replace("{toggle}", `${suffix}`)
			msg.channel.send(loopmsg)
			guildoptions[msg.guild.id].loop=0;
		} else {
			guildoptions[msg.guild.id].loop++;
			if (guildoptions[msg.guild.id].loop === 1) {
				var loopmsg = loopmessage.replace("{toggle}", `on`)
				msg.channel.send(loopmsg)
			}
			if (guildoptions[msg.guild.id].loop >= 2) {
				var loopmsg = loopmessage.replace("{toggle}", `off`)
				guildoptions[msg.guild.id].loop=0;
				msg.channel.send(loopmsg)
			}
		}
	}




	//running the queue in a loop 
	function executeQueue(msg, queue) {
		queue.runningtime = 0;
		if (queue.length === 0) {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection !== null) { 
				voiceConnection.disconnect();
				clearInterval(queue.runningInt)
				clearInterval(queue.checkvc)
				if (no_more_songs_message === 'off') return
				msg.channel.send(no_more_songs_message)
			}
			return
		}

		new Promise((resolve, reject) => {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) {
				if (msg.member.voiceChannel) {
					msg.member.voiceChannel.join().then(connection => {
						resolve(connection);
					}).catch((error) => {
						console.log(error);
					});
				} else {

					queue.splice(0, queue.length);
					reject();
				}
			} else {
				resolve(voiceConnection);
			}
		}).then(connection => {

			const video = queue[0];
var playmsg = playmessage.replace("{song}", `${video.title}`)
			msg.channel.send(playmsg).then(() => {
                ytdl.getInfo(video.link, function(err, info) {
					if (err) {
	
					}
					queue.nplength = info.length_seconds
            })
				let dispatcher = connection.playStream(ytdl(video.link, {filter: 'audioonly'}), {seek: 0, volume: (guildoptions[msg.guild.id].volume/100)});
				queue.runningInt = setInterval(() => {
					queue.runningtime = Math.round(dispatcher.time/1000);	
				}, 1000)
				queue.checkvc = setInterval(() => {
					if (connection.channel.members.size >= 2) return
					msg.channel.send('😴 All members have left the voice channel, so I left too.')
					guildoptions[msg.guild.id].loop=0;
					const queue = getQueue(msg.guild.id);
					queue.splice(0, queue.length);
					clearInterval(queue.runningInt)
					connection.disconnect();
					clearInterval(queue.checkvc)
				}, 60000)
				connection.on('error', (error) => {
					if (guildoptions[msg.guild.id].loop === 1) {queue.push(video)}
					console.log(error);
					queue.shift();
					clearInterval(queue.runningInt)
					executeQueue(msg, queue);
				});

				dispatcher.on('error', (error) => {
					if (guildoptions[msg.guild.id].loop === 1) {queue.push(video)}
					console.log(error);
					queue.shift();
					clearInterval(queue.runningInt)
					executeQueue(msg, queue);
				});

				dispatcher.on('end', () => {
					if (guildoptions[msg.guild.id].loop === 1) {queue.push(video)}
					setTimeout(() => {
						if (queue.length > 0) {
							queue.shift();
							clearInterval(queue.runningInt)
							clearInterval(queue.checkvc)
							executeQueue(msg, queue);
						}
					}, 1000);
				});
			}).catch((error) => {
				console.log(error);
			});
		}).catch((error) => {
			console.log(error);
		});
	}
}
