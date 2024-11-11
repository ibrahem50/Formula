import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Season, SeasonMRData } from '../../interfaces/season.interface';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-season-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './season-card.component.html',
  styleUrl: './season-card.component.scss',
})
export class SeasonCardComponent {
  @Input({ required: true }) seasons!: SeasonMRData;
  @Output() seasonClicked = new EventEmitter<Season>();

  navigateToSeason(row: Season): void {
    this.seasonClicked.emit(row);
  }

  clickUrl(event: Event) {
    event.stopPropagation();
  }
}
