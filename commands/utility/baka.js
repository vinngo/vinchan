const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("baka").setDescription("baka!!"),
  async execute(interaction) {
    await interaction.reply("https://tenor.com/view/baka-anime-gif-22001672");
  },
};
