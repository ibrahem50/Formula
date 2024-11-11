import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Season, SeasonMRData } from '../../interfaces/season.interface';

import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SeasonCardComponent } from './season-card.component';

describe('SeasonCardComponent', () => {
  let component: SeasonCardComponent;
  let fixture: ComponentFixture<SeasonCardComponent>;
  let mockSeasonsData: SeasonMRData;

  beforeEach(async () => {
    mockSeasonsData = {
      SeasonTable: {
        Seasons: [
          { season: '2024', url: 'https://example.com/2024' },
          { season: '2025', url: 'https://example.com/2025' },
        ],
      },
      xmlns: 'http://www.w3.org/2001/XMLSchema-instance',
      series: 'F1',
      url: 'https://example.com/seasons',
      limit: '2',
      offset: '0',
      total: '2',
    };

    await TestBed.configureTestingModule({
      imports: [SeasonCardComponent, MatCardModule, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonCardComponent);
    component = fixture.componentInstance;
    component.seasons = mockSeasonsData;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit seasonClicked event when navigateToSeason is called', () => {
    const season: Season = { season: '2024', url: 'https://example.com/2024' };
    spyOn(component.seasonClicked, 'emit');

    component.navigateToSeason(season);

    expect(component.seasonClicked.emit).toHaveBeenCalledWith(season);
  });

  it('should call stopPropagation on clickUrl method', () => {
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as unknown as Event;

    component.clickUrl(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should emit the correct season data when a card is clicked', () => {
    const season: Season = { season: '2024', url: 'https://example.com/2024' };
    spyOn(component.seasonClicked, 'emit');

    // Find the card element and simulate a click
    const card = fixture.debugElement.query(By.css('.mat-card'));
    card.triggerEventHandler('click', null);

    // Verify the seasonClicked event emitter is called with correct data
    expect(component.seasonClicked.emit).toHaveBeenCalledWith(season);
  });

  it('should stop the event propagation when the URL is clicked', () => {
    // Simulate a click event on the URL and verify stopPropagation is called
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as unknown as Event;
    component.clickUrl(mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
});
