import * as Express from "express";
import { IItemResponse } from "../dto/item_response";
import { fetch as cheerioFetch, FetchResult } from "cheerio-httpcli";

export const router = Express.Router();

router.get("/uxmilk", async (req: Express.Request, res: Express.Response) => {

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