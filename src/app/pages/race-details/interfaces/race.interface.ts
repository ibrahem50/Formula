import { MRData, Race } from '../../../shared/interfaces/formula.interface';

interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

interface Time {
  millis: string;
  time: string;
}

interface Driver {
  driverId: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Result {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: Time;
}

export interface RaceTable {
  season: string;
  round: string;
  Races: RaceDetails[];
}

interface RaceDetails extends Race {
  Results: Result[];
}

export interface RaceDetauilsMRData extends MRData {
  RaceTable: RaceTable;
}

export interface RaceDetailsApiResponse {
  MRData: RaceDetauilsMRData;
}
