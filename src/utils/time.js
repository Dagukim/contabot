function getKoreaTime() {
    const offset = 1000 * 60 * 60 * 9;
    const koreaNow = new Date(new Date().getTime() + offset);
    const koreaNowStr = koreaNow.toISOString().replace("T", " ").split(".")[0];
    return koreaNowStr;
}

module.exports = { getKoreaTime };
