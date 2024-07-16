import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Commnad {
  data: SlashCommandBuilder;
  execute(interaction: CommandInteraction<CacheType>): Promise<void>;
}
