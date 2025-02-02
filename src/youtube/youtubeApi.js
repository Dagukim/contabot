const { google } = require("googleapis");
const { errorWithKoreaTime, logWithKoreaTime } = require("../utils/logger");
require("dotenv").config();

const apiKey = process.env.YOUTUBE_API_KEY;

if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY가 설정되지 않았습니다.");
}

const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
});

async function getChannelIdFromHandle(handle) {
    try {
        const res = await youtube.channels.list({
            part: "snippet",
            forHandle: handle,
        });

        if (res.data.items.length === 0) {
            errorWithKoreaTime("유효한 유튜브 핸들이 아닙니다");
            return null;
        }

        const channelId = res.data.items[0].id;
        return channelId;
    } catch (error) {
        errorWithKoreaTime("핸들로 채널 ID를 가져오는 중 오류 발생 : ");
        return null;
    }
}

async function getYoutubeLiveDetails(handle) {
    const channelId = await getChannelIdFromHandle(handle);
    if (!channelId) return;

    try {
        const res = await youtube.search.list({
            part: "snippet",
            channelId: channelId,
            eventType: "live",
            type: "video",
        });

        const liveStream = res.data.items[0];

        if (!liveStream) {
            logWithKoreaTime("진행중인 라이브 방송이 없습니다");
            return undefined;
        }
        const liveTitle = liveStream.snippet.title;
        const videoId = liveStream.id.videoId;
        const liveUrl = `https://www.youtube.com/watch?v=${videoId}`;
        return { liveTitle, liveUrl };
    } catch (error) {
        errorWithKoreaTime("라이브 방송 정보 가져오기 실패 : ");
    }
}

async function getLatestVideo(handle) {
    const channelId = await getChannelIdFromHandle(handle);
    if (!channelId) return;

    try {
        const channelRes = await youtube.channels.list({
            part: "snippet,contentDetails",
            id: channelId,
        });

        if (channelRes.data.items.length === 0) {
            errorWithKoreaTime("채널을 찾을 수 없습니다");
            return null;
        }

        const playlistId =
            channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;

        const playlistRes = await youtube.playlistItems.list({
            part: "snippet",
            playlistId: playlistId,
            maxResults: 1,
        });

        if (playlistRes.data.items.length === 0) {
            errorWithKoreaTime("재생 목록에서 동영상을 찾을 수 없습니다");
            return null;
        }

        const latestVideoId =
            playlistRes.data.items[0].snippet.resourceId.videoId;

        const videoRes = await youtube.videos.list({
            part: "liveStreamingDetails",
            id: latestVideoId,
        });

        if (videoRes.data.items.length === 0) {
            errorWithKoreaTime("비디오의 상세 정보를 찾을 수 없습니다");
            return null;
        }

        const hasBeenStreamed = videoRes.data.items[0].liveStreamingDetails;

        if (hasBeenStreamed) {
            return null;
        }

        return {
            video: {
                id: latestVideoId,
                title: playlistRes.data.items[0].snippet.title,
                url: `https://www.youtube.com/watch?v=${latestVideoId}`,
                thumbnail:
                    playlistRes.data.items[0].snippet.thumbnails.maxres.url,
            },
            channel: {
                name: channelRes.data.items[0].snippet.title,
                profileImage:
                    channelRes.data.items[0].snippet.thumbnails.default.url,
                url: `https://www.youtube.com/channel/${channelId}`,
            },
        };
    } catch (error) {
        errorWithKoreaTime("최신 비디오 가져오기 오류 : ");
        return null;
    }
}

module.exports = { getYoutubeLiveDetails, getLatestVideo };
