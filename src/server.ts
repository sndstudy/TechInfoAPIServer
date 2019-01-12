import * as Express from "express";
import axios from "axios";

const app = Express();

app.get("/", async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

    // Qiita APIから取得する処理
    const result: any = await axios.get("https://qiita.com/api/v2/items?page=1&per_page=1");

    return res.send(JSON.stringify(result.data));
});

app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
