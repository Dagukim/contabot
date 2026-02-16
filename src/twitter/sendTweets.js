const { TwitterApi } = require("twitter-api-v2");
const { getYoutubeLiveDetails } = require("../youtube/youtubeApi");
const { logWithKoreaTime, errorWithKoreaTime } = require("../utils/logger");
require("dotenv").config();

const {
    TWITTER_APPKEY: appKey,
    TWITTER_APPSECRET: appSecret,
    TWITTER_ACCESSTOKEN: accessToken,
    TWITTER_ACCESSSECRET: accessSecret,
} = process.env;

if (!appKey || !appSecret || !accessToken || !accessSecret) {
    throw new Error("트위터 API 정보가 설정되지 않았습니다.");
}

const twitterClient = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
});

async function sendTweets(setting, streamData) {
    const chzzkLink = `https://chzzk.naver.com/live/${setting.live.chzzkChannelId}`;
    try {
        const ytLiveDetails = await getYoutubeLiveDetails(
            setting.video.youtubeHandle
        );

        const tweetContents = `${
            ytLiveDetails && ytLiveDetails?.liveTitle !== streamData?.liveTitle
                ? `${ytLiveDetails?.liveTitle}\n`
                : ""
        }${streamData?.liveTitle}\n\n${
            setting.video.youtubeHandle && ytLiveDetails?.liveUrl
                ? `${ytLiveDetails?.liveUrl}\n`
                : ""
        }${chzzkLink}`;

        await twitterClient.v2.tweet(tweetContents);
        logWithKoreaTime(`트윗을 보냈습니다.`);
    } catch (err) {
        errorWithKoreaTime("트윗 실패: ", err);
    }
}

module.exports = { sendTweets };
