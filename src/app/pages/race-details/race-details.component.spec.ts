import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceDetailsComponent } from './race-details.component';

describe('RaceDetailsComponent', () => {
  let component: RaceDetailsComponent;
  let fixture: ComponentFixture<RaceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
