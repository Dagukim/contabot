const { Client, Events, GatewayIntentBits } = require("discord.js");
const { handleGuildMemberAdd } = require("./memberHandler");
const { healthCheck } = require("../health/healthCheck");
const { loadGuildSettings } = require("../utils/firestore");
const { startVideoNotifications } = require("./videoNotification");
const { startStreamChecker } = require("../stream/streamChecker");
require("dotenv").config();

const token = process.env.DISCORD_TOKEN;
const PORT = process.env.PORT || 3000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

client.once(Events.ClientReady, () => {
    console.log("Discord bot is ready!");
    client.guilds.cache.forEach(async (guild) => {
        await loadGuildSettings(guild.id);
        startStreamChecker(client, guild.id);
        startVideoNotifications(client, guild.id);
    });
});

client.on(Events.GuildMemberAdd, handleGuildMemberAdd);

client.login(token);

healthCheck.listen(PORT, "0.0.0.0", () => {
    console.log(`Health server running on ${PORT}`);
});
