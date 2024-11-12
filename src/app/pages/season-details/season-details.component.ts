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
    const pinnedRaceRounds = this.loadPinnedRaceRounds();

    this.races$ = this.formulaService
      .getRaces(this.seasonId, offset, this.pageSize)
      .pipe(
        map((res) => {
          const mapped: RaceMRData = {
            ...res,
            RaceTable: {
              ...res.RaceTable,
              Races: res.RaceTable.Races.map((race) => ({
                ...race,
                isPinned: pinnedRaceRounds.includes(race.round),
              })).sort((a, b) => {
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
        })
      );
  }

  savePinnedRaceRounds(pinnedRaceRounds: string[]) {
    sessionStorage.setItem(
      `pinnedRaces${this.seasonId}`,
      JSON.stringify(pinnedRaceRounds)
    );
  }

  loadPinnedRaceRounds(): string[] {
    const data = sessionStorage.getItem(`pinnedRaces${this.seasonId}`);
    return data ? JSON.parse(data) : [];
  }

  togglePin(race: PinnedRace) {
    const pinnedRaceRounds = this.loadPinnedRaceRounds();

    this.races$ = this.races$.pipe(
      map((res) => {
        const isPinned = !pinnedRaceRounds.includes(race.round);
        const newPinnedRounds = isPinned
          ? [...pinnedRaceRounds, race.round]
          : pinnedRaceRounds.filter((round) => round !== race.round);

        this.savePinnedRaceRounds(newPinnedRounds);

        const mapped: RaceMRData = {
          ...res,
          RaceTable: {
            ...res.RaceTable,
            Races: res.RaceTable.Races.map((rc) => ({
              ...rc,
              isPinned: rc.round === race.round ? isPinned : rc.isPinned,
            })).sort((a, b) => {
              if (a.isPinned && !b.isPinned) return -1;
              if (!a.isPinned && b.isPinned) return 1;
              return 0;
            }),
          },
        };
        return mapped;
      })
    );
  }

  onPageChange(event: PageEvent) {
    const index = event.pageIndex;
    this.getRaces(index);
  }

  navigateToRace(race: PinnedRace) {
    this.router.navigate([race.round], {
      relativeTo: this.route,
    });
  }
}
