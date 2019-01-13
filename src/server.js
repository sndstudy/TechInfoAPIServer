"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const axios_1 = require("axios");
const app = Express();
app.get("/", async (req, res, next) => {
    const params = { params: {
            page: 1,
            per_page: 1,
        } };
    // Qiita APIから取得する処理
    const result = await axios_1.default.get("https://qiita.com/api/v2/items", params).catch((err) => {
        return err;
    });
    // 正常時とError時で書き分ける
    return res.send(JSON.stringify(result.data));
});
app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
//# sourceMappingURL=server.js.map