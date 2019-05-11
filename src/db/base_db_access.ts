import * as firebase from "firebase-admin";
import * as serviceAccount from "./tech-info-ss-serviceAccountKey.json";
import { IItemResponse } from "../dto/item_response.js";

export abstract class BaseDbAccess {

    protected static app: firebase.app.App = firebase.initializeApp({
        credential: firebase.credential.cert({...serviceAccount} as firebase.ServiceAccount),
    });

    constructor(){}

    abstract async selectItems(targetSeconds: number, tagName: string) : Promise<IItemResponse[]>;

    abstract async insertItems(itemData: IItemResponse[], nowSeconds: number, tagName: string) :Promise<void>;

}