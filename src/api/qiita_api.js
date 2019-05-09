"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Express = require("express");
const qiita_db_access_1 = require("../db/qiita_db_access");
exports.router = Express.Router();
exports.router.get("/", async (req, res, next) => {
    const params = {
        params: {
            page: req.query.page || 1,
            per_page: req.query.perPage || 20,
            query: req.query.query || 'tag:JavaScript',
        },
    };
    // DBselect 時間　（8時間に一回取得する）
    const nowSeconds = Math.floor(Date.now() / 1000);
    const targetSeconds = nowSeconds - (60 * 60 * 8);
    // コレクション一覧取得
    const qiitaDb = new qiita_db_access_1.QiitaDbAccess();
    let itemData = await qiitaDb.selectItems(targetSeconds);
    if (itemData.length === 0) {
        // Qiita APIから取得する処理
        const response = await axios_1.default.get("https://qiita.com/api/v2/items", params).catch((err) => {
            return err;
        });
        const data = response.data;
        // 必要なものだけ取り出す
        itemData = data.map((item) => {
            return {
                tags: (req.query.query) ? [req.query.query] : ['javascript'],
                title: item.title,
                url: item.url,
                tweetUrl: `https://twitter.com/intent/tweet?text=${item.title}&url=${item.url}`,
            };
        });
        qiitaDb.insertItems(itemData, nowSeconds, req.query.query || 'javascript');
    }
    // ToDo:正常時とError時で書き分ける
    return res.json(itemData);
});
//# sourceMappingURL=qiita_api.js.map