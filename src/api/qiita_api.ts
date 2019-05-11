import axios from "axios";
import * as Express from "express";
import { QiitaDbAccess } from "../db/qiita_db_access";
import { IItemResponse } from "../dto/item_response";
import { IAxiosResponse } from "../dto/axios_response";
import { IQiitaResponse } from "../dto/qiita_response";
import { ErrorEnum } from "../error/error_enum";

export const router = Express.Router();

router.route("/").get(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {

  try {

    const params: any = { 
      params: {
        page: req.query.page || 1,
        per_page: req.query.perPage || 20,
        query: (req.query.query)? `tag:${req.query.query}` : 'tag:JavaScript',
      },
    };

    // DBselect 時間　（8時間に一回取得する）
    const nowSeconds: number = Math.floor(Date.now() / 1000);
    const targetSeconds: number = nowSeconds - (60 * 60 * 8);

    // コレクション一覧取得
    const qiitaDb: QiitaDbAccess = new QiitaDbAccess();
    let itemData: IItemResponse[]  = await qiitaDb.selectItems(targetSeconds, req.query.query);

    if(itemData.length === 0){

      // Qiita APIから取得する処理
      const response: IAxiosResponse =
          await axios.get<IAxiosResponse>("https://qiita.com/api/v2/items", params).catch(
                                          (err: IAxiosResponse): IAxiosResponse => {
                                            throw new Error("axios エラー");
                                          });

      const data: IQiitaResponse[]  = response.data;

      // 必要なものだけ取り出す
      itemData = data.map((item) => {
          return {
              tags: (req.query.query)?[req.query.query] : ['Javascript'],
              title: item.title,
              url: item.url,
              tweetUrl: `https://twitter.com/intent/tweet?text=${item.title}&url=${item.url}`,
          };

      });

      qiitaDb.insertItems(itemData, nowSeconds, req.query.query || 'javascript');
    }

    return res.json(itemData);

  } catch(err) {
    return next(ErrorEnum.InternalServerError);
  }

}).post(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    return next(ErrorEnum.MethodNotAllowed);
}).put(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    return next(ErrorEnum.MethodNotAllowed);
}).delete(async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    return next(ErrorEnum.MethodNotAllowed);
});
