const { Client, GatewayIntentBits, Partials, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages], partials: [Partials.Channel] });

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (msg.content === "!ping") msg.reply("pong!")
});


client.login(process.env.DISCORD_TOKEN);