"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_db_access_1 = require("./base_db_access");
class HackerNewsDbAccess extends base_db_access_1.BaseDbAccess {
    async insertItems(itemData) {
        const db = base_db_access_1.BaseDbAccess.app.firestore();
        const batch = db.batch();
        for (let data of itemData) {
            const docRef = db.collection("hackernews").doc("javascript").collection("jikan").doc();
            await batch.set(docRef, data);
        }
        await batch.commit();
    }
}
exports.HackerNewsDbAccess = HackerNewsDbAccess;
//# sourceMappingURL=hackernews_db_access.js.map