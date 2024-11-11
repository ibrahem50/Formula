import { MRData, Race } from '../../../shared/interfaces/formula.interface';

export interface PinnedRace extends Race {
  isPinned: boolean;
}

interface RaceTable {
  season: string;
  Races: PinnedRace[];
}

export interface RaceMRData extends MRData {
  RaceTable: RaceTable;
}

export interface RaceApiResponse {
  MRData: RaceMRData;
}
