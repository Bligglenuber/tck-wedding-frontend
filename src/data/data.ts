import { DataTopScores } from './DataTopScores';

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface TopScoreDataRaw {
  name: string;
  nameNormalised: string;
  stageId: string;
  score: number;
  timestamp: Timestamp;
  colour: HSL;
}

export interface TopScoreData {
  id: string;
  rank: string;
  name: string;
  stageId: string;
  score: number;
  date: Date;
  colour: HSL;
}

export const dataTopScores = new DataTopScores();
