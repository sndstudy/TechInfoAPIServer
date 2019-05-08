"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_db_access_1 = require("./base_db_access");
class HackerNewsDbAccess extends base_db_access_1.BaseDbAccess {
    async selectItems(targetSeconds) {
        const db = base_db_access_1.BaseDbAccess.app.firestore();
        const docRef = db.collection("hackernews").doc("javascript");
        const collections = await docRef.getCollections();
        // 8時間以内のデータがあるか確認(現在時刻から8時間前と比較)
        const selectResult = collections.find((colRef) => {
            return +colRef.id > targetSeconds;
        });
        const returnItems = [];
        if (selectResult) {
            const data = await db.collection("hackernews").doc("javascript").collection(selectResult.id).get();
            data.forEach((snapshot) => {
                returnItems.push(snapshot.data());
            });
        }
        return returnItems;
    }
    async insertItems(itemData, nowSeconds) {
        const db = base_db_access_1.BaseDbAccess.app.firestore();
        const batch = db.batch();
        for (let data of itemData) {
            const docRef = db.collection("hackernews").doc("javascript").collection(`${nowSeconds}`).doc();
            await batch.set(docRef, data);
        }
        await batch.commit();
    }
}
exports.HackerNewsDbAccess = HackerNewsDbAccess;
//# sourceMappingURL=hackernews_db_access.js.map