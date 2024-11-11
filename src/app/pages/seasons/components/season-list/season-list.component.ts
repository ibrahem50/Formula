import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Season, SeasonMRData } from '../../interfaces/season.interface';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-season-list',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './season-list.component.html',
  styleUrl: './season-list.component.scss',
})
export class SeasonListComponent {
  @Input({ required: true }) seasons!: SeasonMRData;
  @Output() seasonClicked = new EventEmitter<Season>();
  readonly displayedColumns: { title: string; value: string }[] = [
    { title: 'Season', value: 'season' },
    { title: 'Url', value: 'url' },
  ];
  readonly getdisplayedColumns = this.displayedColumns.map((c) => c.value);

  navigateToSeason(row: Season): void {
    this.seasonClicked.emit(row);
  }

  clickUrl(event: Event) {
    event.stopPropagation();
  }
}
