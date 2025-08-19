const {
  ModalBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  MessageFlags,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("configure me! (only works if u are vincent-sama)"),
  async execute(interaction) {
    if (interaction.user.id !== process.env.VIN_USER_ID) {
      await interaction.reply({
        content: "access denied! (u are not vincent-sama)",
        flags: MessageFlags.Ephemeral,
      });
    }

    const modal = new ModalBuilder()
      .setCustomId("config")
      .setTitle("Configure Me!");

    const commandInput = new TextInputBuilder()
      .setCustomId("command")
      .setLabel("Music Bot Command (/play, !play, etc.)")
      .setStyle(TextInputStyle.Short);

    const channelInput = new TextInputBuilder()
      .setCustomId("channel")
      .setLabel("Music Bot Channel (bot, spam, etc.)")
      .setStyle(TextInputStyle.Short);

    const commandRow = new ActionRowBuilder().addComponents(commandInput);
    const channelRow = new ActionRowBuilder().addComponents(channelInput);

    modal.addComponents([commandRow, channelRow]);

    await interaction.showModal(modal);
  },
};
