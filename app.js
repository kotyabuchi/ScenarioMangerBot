const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({
    message: 'Hello, world!',
  })
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

const { Client, GatewayIntentBits, Partials, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages], partials: [Partials.Channel] });
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

console.log(`Login with : ${DISCORD_TOKEN}`);

client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (msg.content === "!ping") msg.reply("pong!")
});


client.login(process.env.DISCORD_TOKEN);