const { ChannelType } = require("discord.js");
const { songs } = require("../../songs.json");

function YouTubeGetID(url) {
  url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}

//returns largest vc per server
function getLargestVC(guild) {
  const channels = guild.channels.cache.filter(
    (c) => c.type === ChannelType.GuildVoice,
  );
  let largest = null;
  let maxMembers = 0;

  channels.forEach((channel) => {
    if (channel.members.size > maxMembers) {
      largest = channel;
      maxMembers = channel.members.size;
    }
  });

  return largest;
}

//play anime opening
async function playAnimeOpening(guild, config) {
  const vc = getLargestVC(guild);

  if (!vc) return;

  let textChannel = null;

  for (const [id, channel] of guild.channels.cache) {
    if (channel.type === ChannelType.GuildText && channel.name === "spam") {
      textChannel = channel;
      break;
    }
  }

  if (!textChannel) {
    return;
  }

  const {
    createAudioPlayer,
    createAudioResource,
    StreamType,
    joinVoiceChannel,
    entersState,
    AudioPlayerStatus,
  } = require("@discordjs/voice");

  const { Innertube, UniversalCache } = require("youtubei.js");

  const innertube = await Innertube.create({ cache: new UniversalCache(true) });

  const connection = joinVoiceChannel({
    channelId: vc.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  random_song = songs[Math.floor(Math.random() * songs.length)];
  random_song_id = YouTubeGetID(random_song);

  const stream = await innertube.download(random_song_id, { type: "audio" });

  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });

  player.play(resource);

  connection.subscribe(player);

  player.on("idle", () => {
    connection.destroy();
  });
}

module.exports = {
  playAnimeOpening,
};
