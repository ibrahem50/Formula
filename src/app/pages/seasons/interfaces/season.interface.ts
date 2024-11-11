import { MRData } from '../../../shared/interfaces/formula.interface';

export interface Season {
  season: string;
  url: string;
}

export interface SeasonTable {
  Seasons: Season[];
}

export interface SeasonMRData extends MRData {
  SeasonTable: SeasonTable;
}

export interface SeasonApiResponse {
  MRData: SeasonMRData;
}
