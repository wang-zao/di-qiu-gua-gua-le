import { getDatabase, ref, child, get, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { FIREBASE_DATABASE_NAME } from '@/utils/constants';


class API {
  firebaseConfig = {
    databaseURL: `https://${FIREBASE_DATABASE_NAME}.firebasedatabase.app`,
  };
  app = initializeApp(this.firebaseConfig);
  database = getDatabase(this.app);

  async getRankList() {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `/`));
    if (snapshot.exists()) {
      const {rankList} = snapshot.val();
      rankList.sort((a: any, b: any) => a.usedTime - b.usedTime);
      return rankList;
    }
    return [];
  }

  async addRankItem(data: any) {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `/`));
    const currentDate = new Date();
    if (snapshot.exists()) {
      const {rankList} = snapshot.val();
      rankList.push({
        ...data,
        date: currentDate.toLocaleDateString(),
      });
      rankList.sort((a: any, b: any) => a.usedTime - b.usedTime);
      await set(ref(this.database, '/'), {
        rankList,
      });
    }
  }
}

export default new API();


