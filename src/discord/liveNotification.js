const { createEmbed } = require("../utils/embeds");
const { getGuildSettings } = require("../utils/firestore");
const { logWithKoreaTime, errorWithKoreaTime } = require("../utils/logger");

async function sendLiveNoti(client, guildId, streamData) {
    try {
        const settings = await getGuildSettings(guildId);
        if (!settings || !settings.live.liveAlertChannelId) {
            return;
        }

        const channel = client.channels.cache.get(
            settings.live.liveAlertChannelId
        );
        if (!channel) throw new Error("해당하는 채널이 없습니다.");

        const embed = createEmbed(
            "live",
            streamData,
            settings.video.youtubeHandle
        );
        await channel.send({ embeds: [embed] });

        logWithKoreaTime(`방송시작 알림을 보냈습니다.`);
    } catch (err) {
        errorWithKoreaTime("방송알림을 보내기에 실패하였습니다: ", err);
    }
}

module.exports = { sendLiveNoti };
