const { ChannelType } = require("discord.js");

songs = [
  "https://www.youtube.com/watch?v=H3axP4norfk&list=RDH3axP4norfk&start_radio=1",
];

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

  console.log(vc.id);

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

  const ytdl = require("ytdl-core");

  const connection = joinVoiceChannel({
    channelId: vc.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();

  const stream = ytdl(songs[Math.floor(Math.random() * songs.length)], {
    filter: "audioonly",
  });
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
