const { getKoreaTime } = require("./time");

function logWithKoreaTime(message) {
    const koreaNowStr = getKoreaTime();
    console.log(`[${koreaNowStr}] ${message}`);
}

function errorWithKoreaTime(message, error) {
    const koreaNowStr = getKoreaTime();
    console.error(`[${koreaNowStr}] ${message}`, error);
}

module.exports = { logWithKoreaTime, errorWithKoreaTime };
