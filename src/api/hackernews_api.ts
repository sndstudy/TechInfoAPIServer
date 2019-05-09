import axios from "axios";
import * as Express from "express";
import { HackerNewsDbAccess } from "../db/hackernews_db_access";
import { IItemResponse } from "../dto/item_response";
import { IAxiosResponse } from "../dto/axios_response";
import { IHackerNewsResponse } from "../dto/hackernews_response";

export const router = Express.Router();

router.route("/").get(async (req: Express.Request, res: Express.Response) => {

    const params: any = { 
      params: {
        hitsPerPage: req.query.perPage || 20,
        query: req.query.query || 'javascript',
        tags: req.query.tags || 'story',
      },
    };

    // DBselect 時間　（8時間に一回取得する）
    const nowSeconds: number = Math.floor(Date.now() / 1000);
    const targetSeconds: number = nowSeconds - (60 * 60 * 8);

    // コレクション一覧取得
    const hackernewsDb: HackerNewsDbAccess = new HackerNewsDbAccess();
    let itemData: IItemResponse[]  = await hackernewsDb.selectItems(targetSeconds);

    if(itemData.length === 0){

        // Hacker News APIから取得する処理
        const response: IAxiosResponse =
            await axios.get<IAxiosResponse>("http://hn.algolia.com/api/v1/search_by_date", params).catch(
                                            (err: IAxiosResponse): IAxiosResponse => {
                                                return err;
                                            });

        const data: IHackerNewsResponse  = response.data;

        // 必要なものだけ取り出す
        itemData = data.hits.map((item) => {
            return {
                tags: (req.query.query)?[req.query.query] : ['javascript'],
                title: item.title,
                url: item.url,
                tweetUrl: `https://twitter.com/intent/tweet?text=${item.title}&url=${item.url}`,
            };
        });

        hackernewsDb.insertItems(itemData, nowSeconds, req.query.query || 'javascript');
    }

    // ToDo:正常時とError時で書き分ける
    return res.status(200).json(itemData);

}).post(async (req: Express.Request, res: Express.Response) => {
    return res.status(405).json({message: "Method Not Allowed"});
}).put(async (req: Express.Request, res: Express.Response) => {
    return res.status(405).json({message: "Method Not Allowed"});
}).delete(async (req: Express.Request, res: Express.Response) => {
    return res.status(405).json({message: "Method Not Allowed"});
});