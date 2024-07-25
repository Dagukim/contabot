const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

const appKey = process.env.TWITTER_APPKEY;
const appSecret = process.env.TWITTER_APPSECRET;
const accessToken = process.env.TWITTER_ACCESSTOKEN;
const accessSecret = process.env.TWITTER_ACCESSSECRET;

const chzzkId = process.env.CHZZK_CHANNEL_ID;
const youtubeId = encodeURI(process.env.YOUTUBE_CHANNEL_ID);
const chzzkLink = `https://chzzk.naver.com/live/${chzzkId}`;
const youtubeLink = `https://www.youtube.com/${youtubeId}/live`;

const twitterClient = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
});

async function sandTweets(streamData) {
    if (!appKey || !appSecret || !accessToken || !accessSecret) {
        return;
    }
    try {
        const tweetContents = `${streamData.liveTitle}\n\n${youtubeLink}\n${chzzkLink}`;
        await twitterClient.v2.tweet(tweetContents);
        console.log(`트윗 성공`);
    } catch (error) {
        console.error("트윗 실패:", error);
    }
}

module.exports = { sandTweets };
