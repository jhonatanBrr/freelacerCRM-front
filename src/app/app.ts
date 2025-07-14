import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './features/navbar/navbar.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    LoaderComponent,
    FontAwesomeModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'FreelancerCRM';

  constructor(
    private router: Router,
    private library: FaIconLibrary
  ) {
    this.library.addIconPacks(fas, far);
  }

  get showNavbar(): boolean {
    return !this.router.url.includes('/login');
  }
}
