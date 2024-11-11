import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, tap } from 'rxjs';
import { Season, SeasonMRData } from './interfaces/season.interface';

import { AppRoute } from '../../app.routes.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaService } from '../../services/formula.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SeasonCardComponent } from './components/season-card/season-card.component';
import { SeasonListComponent } from './components/season-list/season-list.component';

@Component({
  selector: 'app-seasons',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    FormsModule,
    MatIconModule,
    SeasonListComponent,
    SeasonCardComponent,
    MatPaginator,
    MatTableModule,
  ],
  templateUrl: './seasons.component.html',
  styleUrl: './seasons.component.scss',
})
export class SeasonsComponent implements OnInit {
  viewMode: 'list' | 'card' = 'list';
  readonly appRoutes = AppRoute;
  private formulaService = inject(FormulaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  seasons$: Observable<SeasonMRData> = new Observable();
  pageSize: number = 10;
  pageIndex: number = 0;

  ngOnInit(): void {
    this.getSeasons();
  }

  getSeasons(pageIndex?: number) {
    const offset = (pageIndex || 0) * this.pageSize;
    this.seasons$ = this.formulaService.getSeasons(offset, this.pageSize).pipe(
      tap((res) => {
        const index = Math.floor(+res.offset / +res.limit);
        this.pageIndex = index;
      })
    );
  }

  navigateToSeason(season: Season) {
    this.router.navigate([`${season.season}/${this.appRoutes.RACES}`], {
      relativeTo: this.route,
    });
  }

  onPageChange(event: PageEvent) {
    const index = event.pageIndex;
    this.getSeasons(index);
  }
}
