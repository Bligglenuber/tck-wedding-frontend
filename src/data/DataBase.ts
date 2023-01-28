import { EventEmitter } from 'events';
import { initializeApp } from 'firebase/app';
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  query,
  Query,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  Unsubscribe
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBpnZmvio5AT6L6CWrJUJjZmnEchiTshmU',
  authDomain: 'tck-wedding-b97c8.firebaseapp.com',
  projectId: 'tck-wedding-b97c8',
  storageBucket: 'tck-wedding-b97c8.appspot.com',
  messagingSenderId: '467573444140',
  appId: '1:467573444140:web:5d7f6ed6906dcc93850b89'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export class DataBase<DataType> extends EventEmitter {
  protected _filters: Record<string, QueryFieldFilterConstraint> = {};
  protected _orderBy: Array<QueryOrderByConstraint> = [];
  protected _limit: number = 10;
  private _query: Query | null = null;
  private _unsub: Unsubscribe | null = null;

  protected _collectionId: string | null = null;

  get collectionId() {
    return this._collectionId;
  }

  private _data: Array<DataType> = [];

  get data() {
    return this._data;
  }

  protected _init() {
    this._updateQuery();
  }

  protected _updateQuery() {
    if (this._collectionId === null) {
      return;
    }
    this._unsub?.();

    const queryParams = [];
    queryParams.push(...Object.values(this._filters));
    queryParams.push(...this._orderBy);
    queryParams.push(limit(this._limit));
    this._query = query(collection(db, this._collectionId), ...queryParams);

    this._unsub = onSnapshot(this._query, this._onSnapshotHandler.bind(this));
  }

  protected _processDocument(doc: QueryDocumentSnapshot, index: number) {
    return doc.data() as DataType;
  }

  private _onSnapshotHandler(querySnapshot: QuerySnapshot) {
    const data: Array<DataType> = [];
    let index = 0;
    querySnapshot.forEach((doc) => {
      data.push(this._processDocument(doc, index));
      index++;
    });
    this._data = data;
    this.emit('update', data);
  }
}
