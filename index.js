const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  MessageFlags,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { db } = require("./firebase");
const { playAnimeOpening } = require("./lib/helpers/musicHelper");
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

setInterval(async () => {
  const servers = client.guilds.cache;

  for (const [guildId, guild] of servers) {
    const config = db.collection("configs").doc(guildId);
    doc = await config.get();

    if (!doc.exists) continue;

    if (Math.random() < 0.3) {
      playAnimeOpening(db, guild, config);
    }
  }
}, 3600000);

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isModalSubmit()) {
    const modalId = interaction.customId;

    if (modalId === "config") {
      //save to firebase
      console.log("saving to firebase...");
      try {
        const serverId = interaction.guildId;
        const command = interaction.fields.getTextInputValue("command");
        const channel = interaction.fields.getTextInputValue("channel");

        const config = {
          command: command,
          channel: channel,
        };

        await db.collection("configs").doc(serverId).set(config);

        await interaction.reply({
          content: "Config saved!",
          flags: MessageFlags.Ephemeral,
        });
      } catch (e) {
        console.error(`Error saving config: ${e}`);
        await interaction.reply({
          content: "Error saving config!",
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }
  }

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (clock == 0) {
    //chose random gif from gifs
    const randomIndex = Math.floor(Math.random() * gifs.length);
    await message.reply(gifs[randomIndex]);
    clock = 10;
  } else {
    clock--;
  }
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);
