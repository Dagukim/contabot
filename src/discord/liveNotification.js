const { createEmbed } = require("../utils/embeds");
const { sandTweets } = require("../twitter/sandTweets");
require("dotenv").config();

async function sendLiveNoti(client, streamData) {
    try {
        const channel = client.channels.cache.get(
            process.env.DISCORD_CHANNEL_ID
        );
        if (!channel) throw new Error("해당하는 채널이 없습니다.");

        const embed = createEmbed(streamData);
        await channel.send({ embeds: [embed] });

        const offset = 1000 * 60 * 60 * 9;
        const koreaNow = new Date(new Date().getTime() + offset);
        const koreaNowStr = koreaNow
            .toISOString()
            .replace("T", " ")
            .split(".")[0];
        console.log(`${koreaNowStr} 방송시작 알림을 보냈습니다.`);
        sandTweets(streamData);
    } catch (err) {
        console.error("방송알림을 보내기에 실패하였습니다: ", err);
    }
}

module.exports = { sendLiveNoti };
