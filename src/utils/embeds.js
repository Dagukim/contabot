const { EmbedBuilder } = require("discord.js");

function createEmbed(streamData) {
    const chzzkId = process.env.CHZZK_CHANNEL_ID;
    const youtubeId = process.env.YOUTUBE_CHANNEL_ID;
    const profileLink = process.env.PROFILE_LINK;

    const imageUrl = streamData.defaultThumbnailImageUrl
        ? streamData.defaultThumbnailImageUrl
        : streamData.liveImageUrl
        ? streamData.liveImageUrl.replace("{type}", "360")
        : streamData.channel.channelImageUrl;

    const liveCategory =
        streamData.liveCategory?.trim() && streamData.liveCategory?.length > 0
            ? streamData.liveCategory.replace(/_/g, " ")
            : "none";

    const fields = [
        {
            name: "🎮 Category",
            value: liveCategory,
        },
        {
            name: "⚡ CHZZK",
            value: `[link](https://chzzk.naver.com/live/${chzzkId})`,
            inline: true,
        },
    ];
    if (youtubeId) {
        fields.push({
            name: "🔴 YouTube",
            value: `[link](https://www.youtube.com/${youtubeId}/streams)`,
            inline: true,
        });
    }

    const embed = new EmbedBuilder()
        .setColor("#7a2015")
        .setAuthor({
            name: streamData.channel.channelName,
            iconURL: streamData.channel.channelImageUrl,
            url: profileLink ?? undefined,
        })
        .setTitle(streamData.liveTitle)
        .addFields(fields)
        .setImage(imageUrl)
        .setTimestamp();

    return embed;
}

module.exports = { createEmbed };
