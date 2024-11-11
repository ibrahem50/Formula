import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PinnedRace,
  RaceMRData,
} from '../../interfaces/season-details.interface';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-race-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, DatePipe, MatIconModule],
  templateUrl: './race-card.component.html',
  styleUrl: './race-card.component.scss',
})
export class RaceCardComponent {
  @Input({ required: true }) races!: RaceMRData;
  @Output() raceClicked = new EventEmitter<PinnedRace>();
  @Output() pinClicked = new EventEmitter<PinnedRace>();

  navigateToRace(row: PinnedRace): void {
    this.raceClicked.emit(row);
  }

  clickUrl(event: Event) {
    event.stopPropagation();
  }

  togglePin(event: Event, race: PinnedRace): void {
    event.stopPropagation();
    this.pinClicked.emit(race);
  }
}
