const fetch = require("node-fetch");
const { sendLiveNoti } = require("../discord/liveNotification");

const CHZZK_API_URL = `https://api.chzzk.naver.com/service/v2/channels/${process.env.CHZZK_CHANNEL_ID}/live-detail`;

let streamStatus = false;

async function checkStreamStatus(client) {
    try {
        const res = await fetch(CHZZK_API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Platform; Encryption; OS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/Version Safari/537.36",
            },
        });
        if (!res.ok) throw new Error(`HTTP error status: ${res.status}`);
        const data = await res.json();

        const isCurrentLive = data.content && data.content.status === "OPEN";
        if (isCurrentLive && !streamStatus) {
            streamStatus = true;
            sendLiveNoti(client, data.content);
        }
        if (!isCurrentLive && streamStatus) {
            streamStatus = false;
        }
    } catch (err) {
        console.error("스트림 상태를 확인하지 못했습니다: ", err);
    }
}

module.exports = { checkStreamStatus };
