const { SlashCommandBuilder } = require("discord.js");
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
  tokens: 5,
  users: new Map(),
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("talk to vinchan")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("message to send")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const message = interaction.options.getString("message");

    if (!message) {
      await interaction.editReply(
        "Nyaa~ pwease gimme a message to send, nya~!",
      );
      return;
    }

    console.log("Message received:", message);

    //initialize the user in the map.
    if (!this.users.has(interaction.user.id)) {
      this.users.set(interaction.user.id, {
        tokens: this.tokens,
        lastRefill: Date.now(),
      });
    }

    //refill tokens based on last use (daily refill)
    if (
      this.users.get(interaction.user.id).lastRefill + 86400000 <
      Date.now()
    ) {
      this.users.get(interaction.user.id).tokens = this.tokens;
      this.users.get(interaction.user.id).lastRefill = Date.now();
    }

    //check tokens remaining
    if (this.users.get(interaction.user.id).tokens <= 0) {
      await interaction.editReply(
        "Nyaa… you've used up all your meow-tokens! Pwease wait a whole day, nya~ before more purr-fect tokens appear!",
      );
      return;
    }

    //deduct tokens
    this.users.get(interaction.user.id).tokens -= 1;

    try {
      const response = await client.responses.create({
        model: "gpt-5-nano",
        reasoning: { effort: "low" },
        instructions: "Talk like an anime cat-girl",
        max_output_tokens: 450,
        input: message,
      });

      console.log("response:", response.output_text);
      await interaction.editReply(response.output_text);
    } catch (e) {
      console.error(e);
      await interaction.editReply("Nyaa~ something went wrong, nya~!");
    }
  },
};
