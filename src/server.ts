import axios from "axios";
import * as Express from "express";
import * as firebase from "firebase-admin";
import { IAxiosResponse } from "./dto/axios_response";
import { IItemResponse } from "./dto/item_response";
import { IQiitaResponse } from "./dto/qiita_response";
import * as serviceAccount from "./tech-info-ss-serviceAccountKey.json";

const app = Express();

// CORSを許可する
app.use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
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

    // DBへ登録
    const param: any = {...serviceAccount};
    firebase.initializeApp({
        credential: firebase.credential.cert(param),
    });

    const db: FirebaseFirestore.Firestore = firebase.firestore();
    const docRef: FirebaseFirestore.DocumentReference = db.collection("tech-info-item").doc("hogehoge");

    // ToDo:ドキュメントの構造を考える
    await docRef.set({data: JSON.stringify(itemData)});

    // ToDo:正常時とError時で書き分ける
    return res.json(itemData);

});

app.listen(3000, () => {
    console.log("Listen on port 3000.");
});
