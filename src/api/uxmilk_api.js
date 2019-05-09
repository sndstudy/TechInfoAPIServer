"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const cheerio_httpcli_1 = require("cheerio-httpcli");
exports.router = Express.Router();
exports.router.get("/uxmilk", async (req, res) => {
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
//# sourceMappingURL=uxmilk_api.js.map