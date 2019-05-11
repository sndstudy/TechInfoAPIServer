import * as Express from "express";
import { router as QiitaApi } from "./api/qiita_api";
import { router as HackerNewsApi } from "./api/hackernews_api";
import { errorHandler} from "./error/error_handler";

const app = Express();

// CORSを許可する
app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/qiita', QiitaApi);
app.use('/hackernews', HackerNewsApi);
app.use(errorHandler);

app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
