import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const SERVER_ID = process.env.DISCORD_SERVER_ID;

export function RegisterCommand() {
  if (!DISCORD_TOKEN || !APPLICATION_ID || !SERVER_ID) {
    console.error(
      `"DISCORD_TOKEN","APPLICATION_ID"または"SERVER_ID"が見つかりません。`
    );
    process.exit(1);
  }

  const rest = new REST().setToken(DISCORD_TOKEN);

  const foldersPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(foldersPath)
    .filter((file) => file.endsWith(".ts"));
  const commands = [];

  for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(
        `${filePath}コマンドの"data"か"execute"プロパティが見つかりません。`
      );
    }
  }

  // and deploy your commands!
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationGuildCommands(APPLICATION_ID, SERVER_ID),
        {
          body: commands.map((command) => command.data.toJSON()),
        }
      );

      console.log(`Successfully reloaded ${data} application (/) commands.`);
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
  })();
}
