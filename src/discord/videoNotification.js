const { createEmbed } = require("../utils/embeds");
const { getGuildSettings, updateGuildSettings } = require("../utils/firestore");
const { errorWithKoreaTime, logWithKoreaTime } = require("../utils/logger");
const { getLatestVideo } = require("../youtube/youtubeApi");

async function sendVideoNoti(client, guildId) {
    try {
        const settings = await getGuildSettings(guildId);
        const data = await getLatestVideo(settings.platforms.youtubeHandle);

        if (data && data.video.id !== settings.video.latestVideoId) {
            const embed = createEmbed("video", data, settings);

            const channel = client.channels.cache.get(
                settings.video.videoAlertChannelId,
            );
            if (!channel) {
                throw new Error(
                    `채널 ${settings.video.videoAlertChannelId}이(가) 존재하지 않습니다.`,
                );
            }
            await channel.send({
                content: "A new video has been uploaded! 🎬",
                embeds: [embed],
            });

            logWithKoreaTime(`새 동영상 알림을 보냈습니다.`);
            await updateGuildSettings(guildId, {
                video: { latestVideoId: data.video.id },
            });
        }
    } catch (err) {
        errorWithKoreaTime("새 동영상 알림을 보내기에 실패하였습니다: ", err);
    }
}

async function startVideoNotifications(client, guildId) {
    try {
        const settings = await getGuildSettings(guildId);
        if (!settings || !settings.platforms.youtubeHandle) {
            return;
        }

        sendVideoNoti(client, guildId);
        setInterval(() => sendVideoNoti(client, guildId), 300000);
    } catch (err) {
        errorWithKoreaTime("새 동영상 알림 시작에 실패하였습니다: ", err);
    }
}

module.exports = { startVideoNotifications };
