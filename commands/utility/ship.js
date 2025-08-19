const { SlashCommandBuilder } = require("discord.js");
const gifsData = require("../../lib/gifs.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("ship two users")
    .addUserOption((option) =>
      option
        .setName("user1")
        .setDescription("The first user to ship")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option
        .setName("user2")
        .setDescription("The second user to ship")
        .setRequired(true),
    ),
  async execute(interaction) {
    const user1 = interaction.options.getUser("user1");
    const user2 = interaction.options.getUser("user2");
    const compatability = Math.floor(Math.random() * 101);

    let subtitle = "";
    let followUpGif = "";
    if (compatability > 75) {
      subtitle = "✨ The sacred bonds of destiny sparkle in the stars✨";
      followUpGif = gifsData.ship[0];
    } else if (compatability > 30) {
      subtitle = "🤔 These two could work, but only in a filler arc...";
      followUpGif = gifsData.ship[1];
    } else {
      subtitle = "💀 This ship sank faster than the Titanic. RIP. ";
      followUpGif = gifsData.ship[2];
    }

    const message = `${subtitle}
      ${user1} x ${user2}
      Compatability: ${compatability}%`;
    await interaction.reply(message);
    await interaction.followUp(followUpGif);
  },
};
