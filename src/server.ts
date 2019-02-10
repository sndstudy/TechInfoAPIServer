import * as Express from "express";
import axios from "axios";
import { IAxiosResponse } from "./dto/axios_response";
import { IQiitaResponse } from "./dto/qiita_response";
import { IItemResponse } from "./dto/item_response";

const app = Express();

// CORSを許可する
app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/qiita", async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

    const params: any = { params:
                            {
                                page: req.query.page,
                                per_page: req.query.perPage,
                                query: req.query.query,
                             },
                        };

    // Qiita APIから取得する処理
    const response: IAxiosResponse =
        await axios.get<IAxiosResponse>("https://qiita.com/api/v2/items", params).catch(
                                        (err: IAxiosResponse): IAxiosResponse => {
                                            return err;
                                        });

    const data: IQiitaResponse[]  = response.data;

    // 必要なものだけ取り出す
    const itemData: IItemResponse[] = data.map((item) => {
        return {
            tags: item.tags.map((tag) => tag.name),
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
