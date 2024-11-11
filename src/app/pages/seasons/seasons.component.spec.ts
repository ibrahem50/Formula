import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Season, SeasonApiResponse } from './interfaces/season.interface';

import { CommonModule } from '@angular/common';
import { FormulaService } from '../../services/formula.service';
import { SeasonsComponent } from './seasons.component';
import { of } from 'rxjs';

describe('SeasonsComponent', () => {
  let component: SeasonsComponent;
  let fixture: ComponentFixture<SeasonsComponent>;
  let formulaService: jasmine.SpyObj<FormulaService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockSeasonsData: SeasonApiResponse = {
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

  beforeEach(async () => {
    const formulaServiceSpy = jasmine.createSpyObj('FormulaService', [
      'getSeasons',
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, SeasonsComponent, MatPaginatorModule],
      providers: [
        { provide: FormulaService, useValue: formulaServiceSpy },
        ActivatedRoute,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonsComponent);
    component = fixture.componentInstance;
    formulaService = TestBed.inject(
      FormulaService
    ) as jasmine.SpyObj<FormulaService>;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    formulaService.getSeasons.and.returnValue(of(mockSeasonsData.MRData));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSeasons on ngOnInit', () => {
    component.ngOnInit();
    expect(formulaService.getSeasons).toHaveBeenCalled();
  });

  it('should update seasons$ when getSeasons is called', () => {
    component.getSeasons(0);
    component.seasons$.subscribe((data) => {
      expect(data).toEqual(mockSeasonsData.MRData);
    });
  });

  it('should navigate to the correct season details when navigateToSeason is called', () => {
    const season: Season = { season: '2024', url: 'season-url' };
    spyOn(router, 'navigate');
    component.navigateToSeason(season);
    expect(router.navigate).toHaveBeenCalledWith([`${season.season}/races`], {
      relativeTo: activatedRoute,
    });
  });

  it('should update pageIndex when onPageChange is called', () => {
    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 100,
    };
    component.onPageChange(pageEvent);
    expect(component.pageIndex).toBe(pageEvent.pageIndex);
    expect(formulaService.getSeasons).toHaveBeenCalledWith(
      pageEvent.pageIndex,
      component.pageSize
    );
  });

  it('should call getSeasons with the correct offset when onPageChange is triggered', () => {
    const pageEvent: PageEvent = {
      pageIndex: 2,
      pageSize: 10,
      length: 100,
    };
    component.onPageChange(pageEvent);
    expect(formulaService.getSeasons).toHaveBeenCalledWith(
      pageEvent.pageIndex,
      component.pageSize
    );
  });
});
