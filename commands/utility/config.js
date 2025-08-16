const { SlashCommandBuilder, ModalBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configure the Bot"),
  async execute(interaction) {
    if (interaction.user.id !== process.env.VIN_USER_ID) {
      return interaction.reply({
        content: "you are not authorized to use this command",
        ephemeral: true,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId("config_modal")
      .setTitle("Configure Bot");

    await interaction.reply("Configuring...");
  },
};
