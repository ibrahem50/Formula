export enum AppRoute {
  SEASONS = 'seasons',
  RACES = 'races',
}

export const appRoutes = {
  SEASONS: `${AppRoute.SEASONS}`,
  SEASON_DETAILS: `${AppRoute.SEASONS}/:seasonId/${AppRoute.RACES}`,
  RACE_DETAILS: `${AppRoute.SEASONS}/:seasonId/${AppRoute.RACES}/:raceId`,
};

Object.freeze(appRoutes);
