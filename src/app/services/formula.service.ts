import { Injectable, inject } from '@angular/core';
import { Observable, map, of, shareReplay } from 'rxjs';
import {
  RaceApiResponse,
  RaceMRData,
} from '../pages/season-details/interfaces/season-details.interface';
import {
  RaceDetailsApiResponse,
  RaceDetauilsMRData,
} from '../pages/race-details/interfaces/race.interface';
import {
  SeasonApiResponse,
  SeasonMRData,
} from '../pages/seasons/interfaces/season.interface';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FormulaService {
  private httpClient = inject(HttpClient);

  getSeasons(page: number, limit: number): Observable<SeasonMRData> {
    return this.httpClient
      .get<SeasonApiResponse>(
        `${environment.apiUrl}/seasons.json?offset=${page}&limit=${limit}`
      )
      .pipe(
        map((res) => res.MRData),
        shareReplay()
      );
  }

  getRaces(
    seasonId: number,
    page: number,
    limit: number
  ): Observable<RaceMRData> {
    const cachedRaces = sessionStorage.getItem(`races${seasonId}`);
    if (cachedRaces) {
      return of(JSON.parse(cachedRaces));
    }
    return this.httpClient
      .get<RaceApiResponse>(
        `${environment.apiUrl}/${seasonId}/races.json?offset=${page}&limit=${limit}`
      )
      .pipe(
        map((res) => {
          return this.mapRaceData(res);
        }),
        shareReplay()
      );
  }

  private mapRaceData(res: RaceApiResponse) {
    const mapped: RaceMRData = {
      ...res.MRData,
      RaceTable: {
        ...res.MRData.RaceTable,
        Races: res.MRData.RaceTable.Races.map((rt) => {
          return {
            ...rt,
            isPinned: false,
          };
        }),
      },
    };
    return mapped;
  }

  getRaceDetails(
    seasonId: number,
    raceId: number
  ): Observable<RaceDetauilsMRData> {
    return this.httpClient
      .get<RaceDetailsApiResponse>(
        `${environment.apiUrl}/${seasonId}/${raceId}/results.json`
      )
      .pipe(
        map((res) => res.MRData),
        shareReplay()
      );
  }
}
