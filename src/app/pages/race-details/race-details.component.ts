import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Component, inject } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Observable, tap } from 'rxjs';
import { RaceDetauilsMRData, Result } from './interfaces/race.interface';

import { ActivatedRoute } from '@angular/router';
import { AppRoute } from '../../app.routes.enum';
import { CommonModule } from '@angular/common';
import { FormulaService } from '../../services/formula.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-race-details',
  standalone: true,
  imports: [CommonModule, MatTableModule, NgApexchartsModule, MatTabsModule],
  templateUrl: './race-details.component.html',
  styleUrl: './race-details.component.scss',
})
export class RaceDetailsComponent {
  readonly appRoutes = AppRoute;
  private formulaService = inject(FormulaService);
  private route = inject(ActivatedRoute);
  seasonId!: number;
  raceId!: number;
  race$: Observable<RaceDetauilsMRData> = new Observable();
  readonly displayedColumns: { title: string; value: string }[] = [
    { title: 'Position', value: 'position' },
    { title: 'Driver Team', value: 'Constructor.name' },
    { title: 'Driver Name', value: 'Driver.fullName' },
    { title: 'Driver Nationality', value: 'Driver.nationality' },
  ];
  readonly getdisplayedColumns = this.displayedColumns.map((c) => c.value);
  isChartTabActive: boolean = false;
  chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
      title: {
        text: 'Driver',
      },
    },
    yaxis: {
      title: {
        text: 'Time (ms)',
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    colors: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    tooltip: {
      y: {
        formatter: (val: number) => `${val} ms`,
      },
    },
  };

  constructor() {
    this.getSeasonId();
  }

  ngOnInit(): void {
    this.getRaces();
  }

  onTabChange(event: MatTabChangeEvent) {
    this.isChartTabActive = event.index === 1;
  }

  getSeasonId() {
    const seasonIdParam = this.route.snapshot.paramMap.get('seasonId');
    this.seasonId = (seasonIdParam && +seasonIdParam) as number;
    const raceIdParam = this.route.snapshot.paramMap.get('raceId');
    this.raceId = (raceIdParam && +raceIdParam) as number;
  }

  getRaces() {
    this.race$ = this.formulaService
      .getRaceDetails(this.seasonId, this.raceId)
      .pipe(
        tap((res) => {
          const driverNames = res.RaceTable.Races[0].Results.map(
            (driver) => `${driver.Driver.givenName} ${driver.Driver.familyName}`
          );
          const raceTimes = res.RaceTable.Races[0].Results.map((driver) =>
            driver.Time ? parseInt(driver.Time.millis) / 1000 : 0
          );
          if (this.chartOptions.xaxis) {
            this.chartOptions.xaxis.categories = driverNames;
            this.chartOptions.series = [
              {
                name: 'Race Time',
                data: raceTimes,
              },
            ];
          }
        })
      );
  }

  getElementValue(element: Result, path: string) {
    if (path === 'Driver.fullName') {
      return `${element.Driver.givenName} ${element.Driver.familyName}`;
    }
    return path
      .split('.')
      .reduce((acc, part) => acc && (acc as any)[part], element);
  }
}
