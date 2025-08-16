const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.login(token);
