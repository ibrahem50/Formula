import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, map, tap } from 'rxjs';
import { PinnedRace, RaceMRData } from './interfaces/season-details.interface';

import { AppRoute } from '../../app.routes.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulaService } from '../../services/formula.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { RaceCardComponent } from './components/race-card/race-card.component';
import { RaceListComponent } from './components/race-list/race-list.component';

@Component({
  selector: 'app-season-details',
  standalone: true,
  imports: [
    CommonModule,
    RaceListComponent,
    MatPaginator,
    MatButtonToggleModule,
    FormsModule,
    MatIconModule,
    RaceCardComponent,
  ],
  templateUrl: './season-details.component.html',
  styleUrl: './season-details.component.scss',
})
export class SeasonDetailsComponent implements OnInit {
  viewMode: 'list' | 'card' = 'list';
  readonly appRoutes = AppRoute;
  private formulaService = inject(FormulaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  seasonId!: number;
  races$: Observable<RaceMRData> = new Observable();
  pageSize: number = 10;
  pageIndex: number = 0;

  constructor() {
    this.getSeasonId();
  }

  ngOnInit(): void {
    this.getRaces();
  }

  getSeasonId() {
    const seasonIdParam = this.route.snapshot.paramMap.get('seasonId');
    this.seasonId = (seasonIdParam && +seasonIdParam) as number;
  }

  getRaces(pageIndex?: number) {
    const offset = (pageIndex || 0) * this.pageSize;
    this.races$ = this.formulaService
      .getRaces(this.seasonId, offset, this.pageSize)
      .pipe(
        map((res) => {
          const mapped: RaceMRData = {
            ...res,
            RaceTable: {
              ...res.RaceTable,
              Races: res.RaceTable.Races.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return 0;
              }),
            },
          };
          return mapped;
        }),
        tap((res) => {
          const index = Math.floor(+res.offset / +res.limit);
          this.pageIndex = index;
          sessionStorage.setItem(`races${this.seasonId}`, JSON.stringify(res));
        })
      );
  }

  togglePin(race: PinnedRace) {
    this.races$ = this.races$.pipe(
      map((res) => {
        const mapped: RaceMRData = {
          ...res,
          RaceTable: {
            ...res.RaceTable,
            Races: res.RaceTable.Races.map((rc) => {
              return {
                ...rc,
                isPinned: race.round === rc.round ? !rc.isPinned : rc.isPinned,
              };
            }).sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return 0;
            }),
          },
        };
        return mapped;
      }),
      tap((res) => {
        sessionStorage.setItem(`races${this.seasonId}`, JSON.stringify(res));
      })
    );
  }

  navigateToRace(race: PinnedRace) {
    this.router.navigate([race.round], {
      relativeTo: this.route,
    });
  }

  onPageChange(event: PageEvent) {
    const index = event.pageIndex;
    this.getRaces(index);
  }
}
