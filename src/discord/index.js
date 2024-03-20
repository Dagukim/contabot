const { Client, Events, GatewayIntentBits } = require("discord.js");
const { handleGuildMemberAdd } = require("./memberHandler");
const { checkStreamStatus } = require("../stream/streamChecker");
const { healthCheck } = require("../health/healthCheck");
require("dotenv").config();

const token = process.env.DISCORD_TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
});

client.once(Events.ClientReady, () => {
    console.log("Discord bot is ready!");
    checkStreamStatus(client);
    setInterval(() => checkStreamStatus(client), 10000);
});

if (process.env.ROLE_NAME) {
    client.on(Events.GuildMemberAdd, handleGuildMemberAdd);
}

client.login(token);

healthCheck.listen(3000);

