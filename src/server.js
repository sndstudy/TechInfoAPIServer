"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const axios_1 = require("axios");
const app = Express();
app.get("/", async (req, res, next) => {
    const params = { params: { page: 1, per_page: 5 },
    };
    // Qiita APIから取得する処理
    const response = await axios_1.default.get("https://qiita.com/api/v2/items", params).catch((err) => {
        return err;
    });
    const data = response.data;
    // 必要なものだけ取り出す
    const itemData = data.map((item) => {
        return {
            tag: item.tags.map((tag) => tag.name),
            title: item.title,
            url: item.url,
        };
    });
    // 正常時とError時で書き分ける
    return res.json(itemData);
});
app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
//# sourceMappingURL=server.js.map