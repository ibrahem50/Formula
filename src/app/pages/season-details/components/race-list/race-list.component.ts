import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PinnedRace,
  RaceMRData,
} from '../../interfaces/season-details.interface';

import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-race-list',
  standalone: true,
  imports: [MatTableModule, CommonModule, DatePipe, MatIconModule],
  templateUrl: './race-list.component.html',
  styleUrl: './race-list.component.scss',
})
export class RaceListComponent {
  @Input({ required: true }) races!: RaceMRData;
  @Output() raceClicked = new EventEmitter<PinnedRace>();
  readonly displayedColumns: { title: string; value: string }[] = [
    { title: 'Race Name', value: 'raceName' },
    { title: 'Circut Name', value: 'Circuit' },
    { title: 'Date', value: 'date' },
  ];
  readonly getdisplayedColumns = [
    ...this.displayedColumns.map((c) => c.value),
    'Pin',
  ];
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
