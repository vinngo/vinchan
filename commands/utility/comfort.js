const { SlashCommandBuilder } = require("discord.js");

affirmations = [
  "Shh...don't cwy... senpai is hewe fow u (✿◠‿◠)”",
  "*notices sadness* oh no!! i must pweotect you >///<",
  "*hugs tightly* it's going to be ok...uwu",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("comfort")
    .setDescription("for those with heavy hearts"),
  async execute(interaction) {
    await interaction.reply(
      affirmations[Math.floor(Math.random() * affirmations.length)],
    );
  },
};
