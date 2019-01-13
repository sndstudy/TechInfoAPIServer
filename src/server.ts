import * as Express from "express";
import axios from "axios";
import { IAxiosResponse } from "./dto/axios_response";

const app = Express();

app.get("/", async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

    const params: any = { params: {
        page: 1,
        per_page: 1,
    }};

    // Qiita APIから取得する処理
    const result: IAxiosResponse =
        await axios.get<IAxiosResponse>("https://qiita.com/api/v2/items", params).catch(
                                        (err: IAxiosResponse): IAxiosResponse => {
                                            return err;
                                        });

    // 正常時とError時で書き分ける
    return res.send(JSON.stringify(result.data));
});

app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
