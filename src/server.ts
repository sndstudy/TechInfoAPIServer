import axios from "axios";
import * as Express from "express";
import { IAxiosResponse } from "./dto/axios_response";
import { IHackerNewsResponse } from "./dto/hackernews_response"
import { IItemResponse } from "./dto/item_response";
import { IQiitaResponse } from "./dto/qiita_response";
import { fetch as cheerioFetch, FetchResult } from "cheerio-httpcli";
import { HackerNewsDbAccess } from "./db/hackernews_db_access";
import { QiitaDbAccess } from "./db/qiita_db_access";

const app = Express();

// CORSを許可する
app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/qiita", async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

    const params: any = { 
      params: {
        page: req.query.page || 1,
        per_page: req.query.perPage || 20,
        query: req.query.query || 'tag:JavaScript',
      },
    };

    // DBselect 時間　（8時間に一回取得する）
    const nowSeconds: number = Math.floor(Date.now() / 1000);
    const targetSeconds: number = nowSeconds - (60 * 60 * 8);

    // コレクション一覧取得
    const qiitaDb: QiitaDbAccess = new QiitaDbAccess();
    let itemData: IItemResponse[]  = await qiitaDb.selectItems(targetSeconds);

    if(itemData.length === 0){

      // Qiita APIから取得する処理
      const response: IAxiosResponse =
          await axios.get<IAxiosResponse>("https://qiita.com/api/v2/items", params).catch(
                                          (err: IAxiosResponse): IAxiosResponse => {
                                              return err;
                                          });

      const data: IQiitaResponse[]  = response.data;

      // 必要なものだけ取り出す
      itemData = data.map((item) => {
          return {
              tags: (req.query.query)?[req.query.query] : ['javascript'],
              title: item.title,
              url: item.url,
              tweetUrl: `https://twitter.com/intent/tweet?text=${item.title}&url=${item.url}`,
          };

      });

      qiitaDb.insertItems(itemData, nowSeconds, req.query.query || 'javascript');
    }

    // ToDo:正常時とError時で書き分ける
    return res.json(itemData);

});

app.get("/uxmilk", async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

    const response: FetchResult = await cheerioFetch("https://uxmilk.jp/");

    const itemData: IItemResponse[] = [];

    // UX MILK 新着記事の1ページ目から取得する
    response.$(".feed__content a").each((index: number, element: CheerioElement) => {

        itemData.push({
            tags: [],
            title: element.children[0].data.trim(),
            url: element.attribs.href,
        });

    });

    // ToDo:正常時とError時で書き分ける
    return res.json(itemData);

});

app.get("/hackernews", async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

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
    return res.json(itemData);

});

app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
