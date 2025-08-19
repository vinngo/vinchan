songs = [];

//returns largest vc per server
function getLargestVC(guild) {
  const channels = guild.channels.cache.filter((c) => c.type === 2);
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

  if (!vc || vc.members.size === 0) return;

  const textChannel = guild.channels.cache.get(config.channel);

  if (!textChannel) return;

  const { joinVoiceChannel } = require("@discordjs/voice");

  const connection = joinVoiceChannel({
    channelId: vc.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  await new Promsise((r) => setTimeout(r, 2000));

  const command = `${config.command} ${songs[Math.floor(Math.random() * songs.length)]}`;

  await textChannel.send(command);

  setTimeout(() => {
    connection.destroy();
  }, 5000);
}

module.exports = {
  playAnimeOpening,
};
