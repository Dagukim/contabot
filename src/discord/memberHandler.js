const { getGuildSettings } = require("../utils/firestore");
const { logWithKoreaTime, errorWithKoreaTime } = require("../utils/logger");

async function handleGuildMemberAdd(member) {
    const guildId = member.guild.id;

    try {
        const settings = await getGuildSettings(guildId);

        if (!settings || !settings.roleName) {
            return;
        }

        const role = member.guild.roles.cache.find(
            (r) => r.name === settings.roleName
        );
        if (!role) {
            throw new Error("부여할 역할을 찾을 수 없습니다.");
        }

        await member.roles.add(role);
        logWithKoreaTime(
            `새로운 멤버에게 역할을 부여했습니다: ${member.user.tag}`
        );
    } catch (err) {
        errorWithKoreaTime("역할 부여 중 오류가 발생했습니다.", err);
    }
}

module.exports = { handleGuildMemberAdd };
