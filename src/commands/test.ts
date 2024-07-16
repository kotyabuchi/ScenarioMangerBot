import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Pong!を返します。");

export async function execute(interaction: CommandInteraction<CacheType>) {
  await interaction.reply("Pong!");
}
