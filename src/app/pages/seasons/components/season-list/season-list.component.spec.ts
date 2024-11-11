import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { SeasonApiResponse } from '../../interfaces/season.interface';
import { SeasonListComponent } from './season-list.component';

describe('SeasonListComponent', () => {
  let component: SeasonListComponent;
  let fixture: ComponentFixture<SeasonListComponent>;

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
    await TestBed.configureTestingModule({
      imports: [SeasonListComponent, MatTableModule, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of seasons', () => {
    component.seasons = mockSeasonsData.MRData;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(rows.length).toBe(mockSeasonsData.MRData.SeasonTable.Seasons.length);
  });

  it('should emit seasonClicked when a season row is clicked', () => {
    component.seasons = mockSeasonsData.MRData;
    fixture.detectChanges();

    spyOn(component.seasonClicked, 'emit');
    const row = fixture.nativeElement.querySelector('mat-row');
    row.click();

    expect(component.seasonClicked.emit).toHaveBeenCalledWith(
      mockSeasonsData.MRData.SeasonTable.Seasons[0]
    );
  });

  it('should call clickUrl and stop propagation when URL is clicked', () => {
    component.seasons = mockSeasonsData.MRData;
    fixture.detectChanges();
    const mockEvent = { stopPropagation: jasmine.createSpy('stopPropagation') };
    spyOn(component, 'clickUrl');
    const url = fixture.nativeElement.querySelector('a');
    url.click();
    expect(component.clickUrl).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should correctly map displayedColumns', () => {
    component.seasons = mockSeasonsData.MRData;
    fixture.detectChanges();
    const columnTitles = component.getdisplayedColumns;

    expect(columnTitles).toEqual(['season', 'url']);
  });
});
