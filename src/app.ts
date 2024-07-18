import dotenv from "dotenv";
dotenv.config();

// HealthCheck突破用expressコード
import express from "express";
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello, world!",
  });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

// DiscordBotコード
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { Commnad } from "./Command";
import { RegisterCommand } from "./RegisterCommand";

RegisterCommand();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel],
});

// コマンドの内容登録
const commands: Collection<string, Commnad> = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(foldersPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.set(command.data.name, command);
  } else {
    console.warn(
      `${filePath}コマンドの"data"か"execute"プロパティが見つかりません。`
    );
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "!ping") msg.reply("pong!");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  console.log(interaction.options.getSubcommand(false));

  if (!command) {
    console.error(
      `"${interaction.commandName}"コマンドは見つかりませんでした。`
    );
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "このコマンドの実行中にエラーが発生しました！",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "このコマンドの実行中にエラーが発生しました！",
        ephemeral: true,
      });
    }
  }
});

client.login(DISCORD_TOKEN);
