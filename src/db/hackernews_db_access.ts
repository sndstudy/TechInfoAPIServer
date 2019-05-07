import { BaseDbAccess } from "./base_db_access";
import { IItemResponse } from "../dto/item_response";

export class HackerNewsDbAccess extends BaseDbAccess {

  async insertItems(itemData: IItemResponse[]): Promise<void> {
          
    const db: FirebaseFirestore.Firestore = BaseDbAccess.app.firestore();
    const batch: FirebaseFirestore.WriteBatch = db.batch();
  
    for(let data of itemData) {
      const docRef: FirebaseFirestore.DocumentReference = db.collection("hackernews").doc("javascript").collection("jikan").doc();
      await batch.set(docRef, data);
    }

    await batch.commit();
  }

}