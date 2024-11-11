import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { appRoutes } from './../../../app.routes.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly appRoutes = appRoutes;
  readonly imageUrl = 'images/f1_logo.png';
}
