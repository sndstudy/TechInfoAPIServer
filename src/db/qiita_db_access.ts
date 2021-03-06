import { BaseDbAccess } from "./base_db_access";
import { IItemResponse } from "../dto/item_response";

export class QiitaDbAccess extends BaseDbAccess {

  async selectItems(targetSeconds: number, tagName: string): Promise<IItemResponse[]> {
    
    const db: FirebaseFirestore.Firestore = BaseDbAccess.app.firestore();
    const docRef: FirebaseFirestore.DocumentReference = db.collection("qiita").doc(tagName);
    const collections: FirebaseFirestore.CollectionReference[] = 
      await docRef.getCollections().catch(() => {throw new Error("Firebase エラー")});;
    
    // 8時間以内のデータがあるか確認(現在時刻から8時間前と比較)
    const selectResult: FirebaseFirestore.CollectionReference = collections.find((colRef: FirebaseFirestore.CollectionReference) => {
      return +colRef.id > targetSeconds;
    });

    const returnItems: IItemResponse[] = [];

    if(selectResult){
      const data: FirebaseFirestore.QuerySnapshot = 
        await db.collection("qiita").doc(tagName).collection(selectResult.id).get().catch(() => {throw new Error("Firebase エラー")});;
      
      data.forEach((snapshot: FirebaseFirestore.QueryDocumentSnapshot ) => {
        returnItems.push(snapshot.data() as IItemResponse);
      });
    }

    return returnItems;

  }

  async insertItems(itemData: IItemResponse[], nowSeconds: number, tagName: string): Promise<void> {
          
    const db: FirebaseFirestore.Firestore = BaseDbAccess.app.firestore();
    const batch: FirebaseFirestore.WriteBatch = db.batch();
  
    for(let data of itemData) {
      const docRef: FirebaseFirestore.DocumentReference = db.collection("qiita").doc(tagName).collection(`${nowSeconds}`).doc();
      batch.set(docRef, data);
    }

    await batch.commit().catch(() => {throw new Error("Firebase エラー")});;
  }

}