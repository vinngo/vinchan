const {
  SlashCommandBuilder,
  UserSelectMenuBuilder,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");

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

    const menu = new UserSelectMenuBuilder()
      .setCustomId("selectusers")
      .setPlaceholder("Select users")
      .setMinValues(1)
      .setMaxValues(10);

    const row = new ActionRowBuilder().addComponents(menu);
    await interaction.reply({
      content: "Select Users Below",
      components: [row],
      ephemeral: true,
    });

    const msg = await interaction.fetchReply();
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.USER_SELECT,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      const selectedUsers = interaction.values.map((id) =>
        interaction.client.users.cache.get(id),
      );
      await interaction.update({
        content: `Selected Users: ${selectedUsers.map((user) => user.tag).join(", ")}`,
        components: [],
      });
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: "No users selected",
          components: [],
        });
      }
    });
  },
};
