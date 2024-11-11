import { Routes } from '@angular/router';
import { appRoutes } from './app.routes.enum';

export const routes: Routes = [
  {
    path: '',
    redirectTo: appRoutes.SEASONS,
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./seasons.routes').then((m) => m.SEASON_ROUTES),
  },
  {
    path: '**',
    redirectTo: appRoutes.SEASONS,
  },
];
