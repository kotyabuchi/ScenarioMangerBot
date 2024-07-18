import {
  SlashCommandBuilder,
  CacheType,
  ChatInputCommandInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import moment from "moment";

export const data = new SlashCommandBuilder()
  .setName("create")
  .setDescription("各種登録用のコマンドです。")
  .addSubcommand((subCommand) =>
    subCommand
      .setName("account")
      .setDescription("アカウント登録のURLを発行します。")
  )
  .addSubcommand((subCommand) =>
    subCommand.setName("session").setDescription("セッションを作成します。")
  )
  .addSubcommand((subCommand) =>
    subCommand.setName("scenario").setDescription("シナリオを登録します。")
  );

export async function execute(
  interaction: ChatInputCommandInteraction<CacheType>
): Promise<void> {
  // const isExistAccount = await fetch("");
  const subCommand = interaction.options.getSubcommand(false);

  switch (subCommand) {
    case "account": {
      interaction.reply({
        content: "https://scenario-manager.vercel.app/signup",
        ephemeral: true,
      });
    }
    case "session": {
      const user = interaction.user;
      const currentTime = moment().valueOf();

      const modal = new ModalBuilder()
        .setCustomId(`${user.id}-${currentTime}`)
        .setTitle("My Modal");
      // Add components to modal

      // Create the text input components
      const favoriteColorInput = new TextInputBuilder()
        .setCustomId("favoriteColorInput")
        // The label is the prompt the user sees for this input
        .setLabel("What's your favorite color?")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

      const hobbiesInput = new TextInputBuilder()
        .setCustomId("hobbiesInput")
        .setLabel("What's some of your favorite hobbies?")
        // Paragraph means multiple lines of text.
        .setStyle(TextInputStyle.Paragraph);

      // An action row only holds one text input,
      // so you need one action row per text input.
      const firstActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          favoriteColorInput
        );
      const secondActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(hobbiesInput);

      // Add inputs to the modal
      modal.addComponents(firstActionRow, secondActionRow);

      await interaction.showModal(modal);
      break;
    }
    default: {
      interaction.reply({
        content: "指定されたコマンドが見つかりませんでした。",
        ephemeral: true,
      });
    }
  }
}
