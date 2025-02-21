const fetch = require("node-fetch");
const { sendLiveNoti } = require("../discord/liveNotification");
const { sendTweets } = require("../twitter/sendTweets");
const { errorWithKoreaTime } = require("../utils/logger");
const { getGuildSettings, updateGuildSettings } = require("../utils/firestore");

async function checkStreamStatus(client, guildId) {
    try {
        const settings = await getGuildSettings(guildId);
        const chzzkApiUrl = `https://api.chzzk.naver.com/service/v2/channels/${settings.live.chzzkChannelId}/live-detail`;

        const res = await fetch(chzzkApiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Platform; Encryption; OS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/Version Safari/537.36",
            },
        });
        if (!res.ok) throw new Error(`HTTP error status: ${res.status}`);

        const data = await res.json();
        if (!data || !data.content) {
            throw new Error("Invalid response structure: content is missing.");
        }

        const isCurrentLive = data.content && data.content.status === "OPEN";
        if (isCurrentLive && !settings.live.status) {
            sendLiveNoti(client, guildId, data.content);
            if (settings.live.enableTweet) {
                setTimeout(async () => {
                    await sendTweets(settings, data.content);
                }, 180000);
            }
            await updateGuildSettings(guildId, { live: { status: true } });
        }

        if (!isCurrentLive && settings.live.status) {
            await updateGuildSettings(guildId, { live: { status: false } });
        }
    } catch (err) {
        errorWithKoreaTime("스트림 상태를 확인하지 못했습니다: ", err);
    }
}

async function startStreamChecker(client, guildId) {
    try {
        const settings = await getGuildSettings(guildId);
        if (!settings || !settings.live.chzzkChannelId) {
            return;
        }

        checkStreamStatus(client, guildId);
        setInterval(() => checkStreamStatus(client, guildId), 90000);
    } catch (err) {
        errorWithKoreaTime("스트림 체커 시작에 실패하였습니다: ", err);
    }
}

module.exports = { startStreamChecker };
