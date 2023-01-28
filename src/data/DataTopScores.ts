import { orderBy, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { TopScoreData, TopScoreDataRaw } from './data';
import { DataBase } from './DataBase';

const allStageIds = ['0', '1'];

export class DataTopScores extends DataBase<TopScoreData> {
  private _addRank: boolean = true;

  constructor() {
    super();
    this._collectionId = 'topScores';
    this._orderBy = [
      orderBy('score', 'desc'),
      orderBy('timestamp', 'asc'),
    ];
    this._limit = 100;
    this._init();
  }

  protected _stageIdFilter: string[] | null = allStageIds;

  get stageIdFilter() {
    return this._stageIdFilter;
  }

  protected _nameFilter: string | null = null;

  get nameFilter() {
    return this._nameFilter;
  }

  get allStageIds() {
    return allStageIds;
  }

  setStageIdFilter(acceptedStageIds: string[] | null) {
    this._stageIdFilter = acceptedStageIds;
    if (acceptedStageIds) {
      if (allStageIds.every(stageId => {
        return acceptedStageIds.includes(stageId);
      })) {
        // Matching all elements, so remove filter
        delete this._filters['stageId'];
      } else {
        this._filters['stageId'] = where('stageId', 'in', acceptedStageIds);
      }
    } else {
      delete this._filters['stageId'];
    }
    this._updateQuery();
  }

  setNameFilter(name: string | null) {
    this._nameFilter = name;
    if (name) {
      this._addRank = false;
      this._orderBy = [
        orderBy('nameNormalised', 'asc'),
        orderBy('score', 'desc'),
        orderBy('timestamp', 'asc'),
      ];
      this._filters['name1'] = where('nameNormalised', '>=', name.toLowerCase());
      this._filters['name2'] = where('nameNormalised', '<=', name.toLowerCase() + '\uf8ff');
    } else {
      this._addRank = true;
      this._orderBy = [
        orderBy('score', 'desc'),
        orderBy('timestamp', 'asc'),
      ];
      delete this._filters['name1'];
      delete this._filters['name2'];
    }
    this._updateQuery();
  }

  protected _processDocument(doc: QueryDocumentSnapshot, index: number) {
    const id = doc.id;
    const rank = this._addRank ? `${index + 1}` : '-';
    const { name, stageId, score, timestamp, colour } = doc.data() as TopScoreDataRaw;
    const { seconds, nanoseconds } = timestamp;
    const date = new Date((seconds * 1000) + (nanoseconds / 1e6));
    const topScoreData: TopScoreData = {
      id,
      rank,
      name,
      stageId,
      score,
      date,
      colour
    };
    return topScoreData;
  }
}
