"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Express = require("express");
const firebase = require("firebase-admin");
const serviceAccount = require("./tech-info-ss-serviceAccountKey.json");
const app = Express();
// CORSを許可する
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/qiita", async (req, res, next) => {
    const params = { params: {
            page: req.query.page,
            per_page: req.query.perPage,
            query: req.query.query,
        },
    };
    // Qiita APIから取得する処理
    const response = await axios_1.default.get("https://qiita.com/api/v2/items", params).catch((err) => {
        return err;
    });
    const data = response.data;
    // 必要なものだけ取り出す
    const itemData = data.map((item) => {
        return {
            tags: item.tags.map((tag) => tag.name),
            title: item.title,
            url: item.url,
        };
    });
    // DBへ登録
    const param = Object.assign({}, serviceAccount);
    firebase.initializeApp({
        credential: firebase.credential.cert(param),
    });
    const db = firebase.firestore();
    const docRef = db.collection("tech-info-item").doc("hogehoge");
    // await docRef.set(itemData);
    await docRef.set({ data: JSON.stringify(itemData) });
    // 正常時とError時で書き分ける
    return res.json(itemData);
});
app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
//# sourceMappingURL=server.js.map