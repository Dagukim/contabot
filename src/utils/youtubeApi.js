const { google } = require("googleapis");
require("dotenv").config();

const YT_API_KEY = process.env.YOUTUBE_APIKEY;

const youtube = google.youtube({
    version: "v3",
    auth: YT_API_KEY,
});

async function getYoutubeLiveDetails(CHANNEL_ID) {
    if (!YT_API_KEY || !CHANNEL_ID) return;
    try {
        const res = await youtube.search.list({
            part: "snippet",
            channelId: CHANNEL_ID,
            eventType: "live",
            type: "video",
        });

        const liveStream = res.data.items[0];

        if (!liveStream) {
            console.log("진행중인 라이브 방송이 없습니다.");
            return undefined;
        }
        const ytLiveTitle = liveStream.snippet.title;
        const videoId = liveStream.id.videoId;
        const ytLiveUrl = `https://www.youtube.com/watch?v=${videoId}`;
        return { ytLiveTitle, ytLiveUrl };
    } catch (error) {
        console.error("라이브 방송 정보 가져오기 실패:", error);
    }
}

module.exports = { getYoutubeLiveDetails };
