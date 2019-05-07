"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Express = require("express");
const cheerio_httpcli_1 = require("cheerio-httpcli");
const hackernews_db_access_1 = require("./db/hackernews_db_access");
const app = Express();
// CORSを許可する
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/qiita", async (req, res, next) => {
    const params = {
        params: {
            page: req.query.page || 1,
            per_page: req.query.perPage || 20,
            query: req.query.query || 'tag:JavaScript',
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
            tweetUrl: `https://twitter.com/intent/tweet?text=${item.title}&url=${item.url}`,
        };
    });
    // DBへ登録
    // ToDo:正常時とError時で書き分ける
    return res.json(itemData);
});
app.get("/uxmilk", async (req, res, next) => {
    const response = await cheerio_httpcli_1.fetch("https://uxmilk.jp/");
    const itemData = [];
    // UX MILK 新着記事の1ページ目から取得する
    response.$(".feed__content a").each((index, element) => {
        itemData.push({
            tags: [],
            title: element.children[0].data.trim(),
            url: element.attribs.href,
        });
    });
    // ToDo:正常時とError時で書き分ける
    return res.json(itemData);
});
app.get("/hackernews", async (req, res, next) => {
    const params = {
        params: {
            hitsPerPage: req.query.perPage || 20,
            query: req.query.query || 'javascript',
            tags: req.query.tags || 'story',
        },
    };
    // Hacker News APIから取得する処理
    const response = await axios_1.default.get("http://hn.algolia.com/api/v1/search_by_date", params).catch((err) => {
        return err;
    });
    const data = response.data;
    // 必要なものだけ取り出す
    const itemData = data.hits.map((item) => {
        return {
            tags: ["javascript"],
            title: item.title,
            url: item.url,
            tweetUrl: `https://twitter.com/intent/tweet?text=${item.title}&url=${item.url}`,
        };
    });
    // ToDo: DBはモジュールとして分ける
    // const param: any = {...serviceAccount};
    // firebase.initializeApp({
    //     credential: firebase.credential.cert(param),
    // });
    // const db: FirebaseFirestore.Firestore = firebase.firestore();
    // const batch: FirebaseFirestore.WriteBatch = db.batch();
    // // ToDo:ドキュメントの構造を考える
    // for(let data of itemData) {
    //   const docRef: FirebaseFirestore.DocumentReference = db.collection("hackernews").doc("javascript").collection("jikan").doc();
    //   await batch.set(docRef, data);
    // }
    // await batch.commit();
    const hackernewsDb = new hackernews_db_access_1.HackerNewsDbAccess();
    hackernewsDb.insertItems(itemData);
    // ToDo:正常時とError時で書き分ける
    return res.json(itemData);
});
app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
//# sourceMappingURL=server.js.map