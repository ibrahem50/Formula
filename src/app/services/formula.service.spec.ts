import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  RaceApiResponse,
  RaceMRData,
} from '../pages/season-details/interfaces/season-details.interface';

import { FormulaService } from './formula.service';
import { RaceDetailsApiResponse } from '../pages/race-details/interfaces/race.interface';
import { SeasonApiResponse } from '../pages/seasons/interfaces/season.interface';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';

describe('FormulaService', () => {
  let service: FormulaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormulaService, provideHttpClientTesting()],
    });
    service = TestBed.inject(FormulaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSeasons', () => {
    it('should return the correct season data', () => {
      const mockResponse: SeasonApiResponse = {
        MRData: {
          xmlns: 'some-url',
          series: 'some-series',
          url: 'some-api-url',
          limit: '10',
          offset: '0',
          total: '100',
          SeasonTable: {
            Seasons: [
              { season: '2024', url: 'season-url' },
              { season: '2023', url: 'season-url' },
            ],
          },
        },
      };

      service.getSeasons(1, 10).subscribe((data) => {
        expect(data.SeasonTable.Seasons.length).toBe(2);
        expect(data.SeasonTable.Seasons[0].season).toBe('2024');
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/seasons.json?offset=1&limit=10`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getRaces', () => {
    it('should return cached races if available', () => {
      const seasonId = 2024;
      const mockCachedData: RaceMRData = {
        xmlns: 'some-url',
        series: 'some-series',
        url: 'some-api-url',
        limit: '10',
        offset: '0',
        total: '100',
        RaceTable: {
          season: '2024',
          Races: [],
        },
      };
      sessionStorage.setItem(
        `races${seasonId}`,
        JSON.stringify(mockCachedData)
      );

      service.getRaces(seasonId, 1, 10).subscribe((data) => {
        expect(data.RaceTable.Races.length).toBe(2);
        expect(data.RaceTable.Races[0].raceName).toBe('Race 1');
      });
    });

    it('should fetch and map race data if no cached data', () => {
      const seasonId = 2024;
      const mockResponse: RaceApiResponse = {
        MRData: {
          xmlns: 'some-url',
          series: 'some-series',
          url: 'some-api-url',
          limit: '10',
          offset: '0',
          total: '100',
          RaceTable: {
            season: '2024',
            Races: [],
          },
        },
      };

      service.getRaces(seasonId, 1, 10).subscribe((data) => {
        expect(data.RaceTable.Races.length).toBe(2);
        expect(data.RaceTable.Races[0].isPinned).toBe(false);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/${seasonId}/races.json?offset=1&limit=10`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getRaceDetails', () => {
    it('should return race details', () => {
      const seasonId = 2024;
      const raceId = 1;
      const mockResponse: RaceDetailsApiResponse = {
        MRData: {
          xmlns: 'some-url',
          series: 'some-series',
          url: 'some-api-url',
          limit: '10',
          offset: '0',
          total: '100',
          RaceTable: {
            season: '2024',
            round: '1',
            Races: [],
          },
        },
      };

      service.getRaceDetails(seasonId, raceId).subscribe((data) => {
        expect(data.RaceTable.Races.length).toBe(1);
        expect(data.RaceTable.Races[0].raceName).toBe('Race 1');
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/${seasonId}/${raceId}/results.json`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
