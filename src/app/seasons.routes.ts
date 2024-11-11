import { Routes } from '@angular/router';
import { appRoutes } from './app.routes.enum';

export const SEASON_ROUTES: Routes = [
  {
    path: appRoutes.SEASONS,
    loadComponent: () =>
      import('./pages/seasons/seasons.component').then(
        (c) => c.SeasonsComponent
      ),
  },
  {
    path: appRoutes.SEASON_DETAILS,
    loadComponent: () =>
      import('./pages/season-details/season-details.component').then(
        (c) => c.SeasonDetailsComponent
      ),
  },
  {
    path: appRoutes.RACE_DETAILS,
    loadComponent: () =>
      import('./pages/race-details/race-details.component').then(
        (c) => c.RaceDetailsComponent
      ),
  },
];
