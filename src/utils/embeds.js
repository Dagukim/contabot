const { EmbedBuilder } = require("discord.js");
const { logWithKoreaTime } = require("./logger");

function createEmbed(type, resData, ytHandle) {
    if (type === "live") {
        const imageUrl = resData.defaultThumbnailImageUrl
            ? resData.defaultThumbnailImageUrl
            : resData.liveImageUrl
            ? resData.liveImageUrl.replace("{type}", "360")
            : resData.channel.channelImageUrl;

        const liveCategory =
            resData.liveCategory?.trim() && resData.liveCategory?.length > 0
                ? resData.liveCategory.replace(/_/g, " ")
                : "none";

        const fields = [
            {
                name: "🎮 Category",
                value: liveCategory,
            },
            {
                name: "⚡ CHZZK",
                value: `[link](https://chzzk.naver.com/live/${resData.channel.channelId})`,
                inline: true,
            },
        ];
        if (ytHandle) {
            fields.push({
                name: "🔴 YouTube",
                value: `[link](https://www.youtube.com/${ytHandle}/live)`,
                inline: true,
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#7a2015")
            .setAuthor({
                name: resData.channel.channelName,
                iconURL: resData.channel.channelImageUrl,
            })
            .setTitle(resData.liveTitle)
            .addFields(fields)
            .setImage(imageUrl)
            .setTimestamp();

        return embed;
    }

    if (type === "video") {
        const embed = new EmbedBuilder()
            .setColor("#7a2015")
            .setAuthor({
                name: resData.channel.name,
                iconURL: resData.channel.profileImage,
                url: resData.channel.url,
            })
            .setTitle(resData.video.title)
            .setURL(resData.video.url)
            .setImage(resData.video.thumbnail)
            .setTimestamp();

        return embed;
    }

    logWithKoreaTime("embed type이 유효하지 않습니다.");
    return null;
}

module.exports = { createEmbed };
