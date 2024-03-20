async function handleGuildMemberAdd(member) {
    try {
        const roleName = process.env.ROLE_NAME;
        const role = member.guild.roles.cache.find((r) => r.name === roleName);
        if (!role) {
            console.log("부여할 역할을 찾을 수 없습니다.");
            return;
        }

        await member.roles.add(role);
        console.log(`새로운 멤버에게 역할을 부여했습니다: ${member.user.tag}`);
    } catch (err) {
        console.error("역할 부여 중 오류가 발생했습니다.", err);
    }
}

module.exports = { handleGuildMemberAdd };
