"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_db_access_1 = require("./base_db_access");
class HackerNewsDbAccess extends base_db_access_1.BaseDbAccess {
    async selectItems(targetSeconds, tagName) {
        const db = base_db_access_1.BaseDbAccess.app.firestore();
        const docRef = db.collection("hackernews").doc(tagName);
        const collections = await docRef.getCollections().catch(() => { throw new Error("Firebase エラー"); });
        // 8時間以内のデータがあるか確認(現在時刻から8時間前と比較)
        const selectResult = collections.find((colRef) => {
            return +colRef.id > targetSeconds;
        });
        const returnItems = [];
        if (selectResult) {
            const data = await db.collection("hackernews").doc(tagName).collection(selectResult.id).get().catch(() => { throw new Error("Firebase エラー"); });
            ;
            data.forEach((snapshot) => {
                returnItems.push(snapshot.data());
            });
        }
        return returnItems;
    }
    async insertItems(itemData, nowSeconds, tagName) {
        const db = base_db_access_1.BaseDbAccess.app.firestore();
        const batch = db.batch();
        for (let data of itemData) {
            const docRef = db.collection("hackernews").doc(tagName).collection(`${nowSeconds}`).doc();
            batch.set(docRef, data);
        }
        await batch.commit().catch(() => { throw new Error("Firebase エラー"); });
        ;
    }
}
exports.HackerNewsDbAccess = HackerNewsDbAccess;
//# sourceMappingURL=hackernews_db_access.js.map