const { EmbedBuilder } = require("discord.js");
const { logWithKoreaTime } = require("./logger");

function createEmbed(type, resData, ytHandle, extraLinks) {
    const validTypes = ["live", "video"];
    if (!validTypes.includes(type)) {
        logWithKoreaTime("유효하지 않은 embed type입니다.");
        return null;
    }

    if (type === "live") {
        const imageUrl =
            resData.defaultThumbnailImageUrl ??
            resData.liveImageUrl?.replace("{type}", "360") ??
            resData.channel?.channelImageUrl;

        const liveCategory = resData.liveCategory?.trim()
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

        for (const link of extraLinks ?? []) {
            if (fields.length >= 10) break;
            if (!link?.name || !link?.url) continue;

            fields.push({
                name: link.name,
                value: `[link](${link.url})`,
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

    return null;
}

module.exports = { createEmbed };
