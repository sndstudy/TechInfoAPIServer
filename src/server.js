"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const axios_1 = require("axios");
const app = Express();
app.get("/", async (req, res, next) => {
    // Qiita APIから取得する処理
    const result = await axios_1.default.get("https://qiita.com/api/v2/items?page=1&per_page=1");
    return res.send(JSON.stringify(result.data));
});
app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
//# sourceMappingURL=server.js.map