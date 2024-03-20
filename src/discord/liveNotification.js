const { createEmbed } = require("../utils/embeds");
require("dotenv").config();

async function sendLiveNoti(client, streamData) {
    try {
        const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
        if (!channel) throw new Error("해당하는 채널이 없습니다.");

        const embed = createEmbed(streamData);

        await channel.send({ embeds: [embed] });
        console.log("방송시작 알림을 보냈습니다.");
    } catch (err) {
        console.error("방송알림을 보내기에 실패하였습니다: ", err);
    }
}

module.exports = { sendLiveNoti };
