"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Express = require("express");
const hackernews_db_access_1 = require("../db/hackernews_db_access");
const error_enum_1 = require("../error/error_enum");
exports.router = Express.Router();
exports.router.route("/").get(async (req, res, next) => {
    try {
        const params = {
            params: {
                hitsPerPage: req.query.perPage || 20,
                query: req.query.query || 'javascript',
                tags: req.query.tags || 'story',
            },
        };
        // DBselect 時間　（8時間に一回取得する）
        const nowSeconds = Math.floor(Date.now() / 1000);
        const targetSeconds = nowSeconds - (60 * 60 * 8);
        // コレクション一覧取得
        const hackernewsDb = new hackernews_db_access_1.HackerNewsDbAccess();
        let itemData = await hackernewsDb.selectItems(targetSeconds, req.query.query);
        if (itemData.length === 0) {
            // Hacker News APIから取得する処理
            const response = await axios_1.default.get("http://hn.algolia.com/api/v1/search_by_date", params).catch((err) => {
                throw new Error("axios エラー");
            });
            const data = response.data;
            // 必要なものだけ取り出す
            itemData = data.hits.map((item) => {
                return {
                    tags: (req.query.query) ? [req.query.query] : ['javascript'],
                    title: item.title,
                    url: item.url,
                    tweetUrl: `https://twitter.com/intent/tweet?text=${item.title}&url=${item.url}`,
                };
            });
            await hackernewsDb.insertItems(itemData, nowSeconds, req.query.query || 'javascript');
        }
        return res.status(200).json(itemData);
    }
    catch (err) {
        return next(error_enum_1.ErrorEnum.InternalServerError);
    }
}).post(async (req, res, next) => {
    return next(error_enum_1.ErrorEnum.MethodNotAllowed);
}).put(async (req, res, next) => {
    return next(error_enum_1.ErrorEnum.MethodNotAllowed);
}).delete(async (req, res, next) => {
    return next(error_enum_1.ErrorEnum.MethodNotAllowed);
});
//# sourceMappingURL=hackernews_api.js.map