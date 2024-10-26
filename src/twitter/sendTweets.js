const { TwitterApi } = require("twitter-api-v2");
const { getYoutubeLiveDetails } = require("../utils/youtubeApi");
require("dotenv").config();

if (
    !process.env.TWITTER_APPKEY ||
    !process.env.TWITTER_APPSECRET ||
    !process.env.TWITTER_ACCESSTOKEN ||
    !process.env.TWITTER_ACCESSSECRET
) {
    console.error("트위터 API 키와 토큰이 설정되지 않았습니다.");
    return;
}

const appKey = process.env.TWITTER_APPKEY;
const appSecret = process.env.TWITTER_APPSECRET;
const accessToken = process.env.TWITTER_ACCESSTOKEN;
const accessSecret = process.env.TWITTER_ACCESSSECRET;

const chzzkId = process.env.CHZZK_CHANNEL_ID;
const youtubeId = process.env.YOUTUBE_CHANNEL_ID;
const chzzkLink = `https://chzzk.naver.com/live/${chzzkId}`;
// const youtubeLink = `https://www.youtube.com/channel/${youtubeId}/live`;

const twitterClient = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
});

async function sendTweets(streamData) {
    try {
        const ytLive = await getYoutubeLiveDetails(youtubeId);
        const tweetContents = `${
            ytLive && ytLive.ytLiveTitle !== streamData.liveTitle
                ? `${ytLive.ytLiveTitle}\n`
                : ""
        }${streamData.liveTitle}\n\n${
            youtubeId ? `${ytLive.ytLiveUrl}\n` : ""
        }${chzzkLink}`;
        await twitterClient.v2.tweet(tweetContents);
        console.log(`트윗을 보냈습니다.`);
    } catch (error) {
        console.error("트윗 실패:", error);
    }
}

module.exports = { sendTweets };
