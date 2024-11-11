import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  private LoaderService = inject(LoaderService);
  isLoading$: Observable<boolean> = new Observable();

  constructor() {
    this.isLoading$ = this.LoaderService.isLoading$;
  }
}
