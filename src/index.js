"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const qiita_api_1 = require("./api/qiita_api");
const hackernews_api_1 = require("./api/hackernews_api");
const error_handler_1 = require("./error/error_handler");
const app = Express();
// CORSを許可する
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/qiita', qiita_api_1.router);
app.use('/hackernews', hackernews_api_1.router);
app.use(error_handler_1.errorHandler);
app.listen(process.env.PORT || 3000);
//# sourceMappingURL=index.js.map