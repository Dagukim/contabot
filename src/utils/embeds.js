const { EmbedBuilder } = require("discord.js");

function createEmbed(streamData) {
    const imageUrl = streamData.defaultThumbnailImageUrl
        ? streamData.defaultThumbnailImageUrl
        : streamData.liveImageUrl
        ? streamData.liveImageUrl.replace("{type}", "360")
        : streamData.channel.channelImageUrl;

    const embed = new EmbedBuilder()
        .setColor("#7a2015")
        .setAuthor({
            name: streamData.channel.channelName,
            iconURL: streamData.channel.channelImageUrl,
        })
        .setTitle(streamData.liveTitle)
        .addFields(
            { name: "Category", value: streamData.liveCategory.replace(/_/g, " ") },
            {
                name: "CHZZK",
                value: `[link](https://chzzk.naver.com/live/${process.env.CHZZK_CHANNEL_ID})`,
                inline: true,
            },
            ...(process.env.YOUTUBE_CHANNEL_ID
                ? {
                      name: "YouTube",
                      value: `[link](https://www.youtube.com/${process.env.YOUTUBE_CHANNEL_ID}/streams)`,
                      inline: true,
                  }
                : [])
        )
        .setImage(imageUrl)
        .setTimestamp();

    return embed;
}

module.exports = { createEmbed };
