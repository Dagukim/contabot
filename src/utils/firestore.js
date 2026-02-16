const { Firestore } = require("@google-cloud/firestore");
const { logWithKoreaTime, errorWithKoreaTime } = require("./logger");
const { deepMerge } = require("./deepMerge");
const { getKoreaTime } = require("./time");
require("dotenv").config();

const {
    FIRESTORE_PROJECT_ID: projectId,
    FIRESTORE_CLIENT_EMAIL: clientEmail,
    FIRESTORE_PRIVATE_KEY: privateKey,
} = process.env;

const db = new Firestore({
    projectId: projectId,
    credentials: {
        client_email: clientEmail,
        private_key: privateKey?.replace(/\\n/g, "\n"),
    },
});

const cache = {};

const defaultSettings = {
    live: {
        chzzkChannelId: "",
        enableTweet: false,
        liveAlertChannelId: "",
        status: false,
    },
    video: {
        latestVideoId: "",
        videoAlertChannelId: "",
        youtubeHandle: "",
    },
    roleName: "",
};

async function loadGuildSettings(guildId) {
    try {
        const docRef = db.collection("guilds").doc(guildId);
        const doc = await docRef.get();

        if (!doc.exists) {
            logWithKoreaTime(
                "서버 설정이 Firestore에 없습니다. 기본 설정을 생성합니다."
            );
            await docRef.set(defaultSettings);
            cache[guildId] = defaultSettings;
            return;
        }

        cache[guildId] = doc.data();
        logWithKoreaTime("서버 설정이 로드되었습니다.");
    } catch (err) {
        errorWithKoreaTime("설정 로드 실패:", err);
    }
}

function getGuildSettings(guildId) {
    return cache[guildId] || null;
}

async function updateGuildSettings(guildId, newSettings) {
    try {
        newSettings.updatedAt = getKoreaTime();
        cache[guildId] = deepMerge(cache[guildId], newSettings);

        const guildRef = db.collection("guilds").doc(guildId);
        await guildRef.set(cache[guildId], { merge: true });
        logWithKoreaTime("서버 설정이 업데이트되었습니다.");
    } catch (err) {
        errorWithKoreaTime("설정 저장 실패:", err);
    }
}

async function deleteGuildSettings(guildId) {
    try {
        delete cache[guildId];

        await db.collection("guilds").doc(guildId).delete();
        logWithKoreaTime("서버 설정이 삭제되었습니다.");
    } catch (err) {
        errorWithKoreaTime("서버 설정 삭제에 실패하였습니다.", err);
    }
}

module.exports = {
    loadGuildSettings,
    getGuildSettings,
    updateGuildSettings,
    deleteGuildSettings,
};
