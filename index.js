const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

const token = process.env.DISCORD_TOKEN;

let clock = 0;

const gifs = [
  "https://tenor.com/view/baka-anime-gif-22001672",
  "https://tenor.com/view/anime-girl-shy-hearts-cover-face-gif-17478014",
  "https://tenor.com/view/angry-gif-6367919497800974711",
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

// Create a collection to store commands
client.commands = new Collection();

// Load commands from the commands directory
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// Handle every 5th message
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (clock == 0) {
    //chose random gif from gifs
    const randomIndex = Math.floor(Math.random() * gifs.length);
    await message.reply(gifs[randomIndex]);
    clock = 5;
  } else {
    clock--;
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
