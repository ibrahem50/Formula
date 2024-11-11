import { Component, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/components/header/header.component';
import { LoaderComponent } from './core/components/loader/loader.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'formula-one-explorer';
}
