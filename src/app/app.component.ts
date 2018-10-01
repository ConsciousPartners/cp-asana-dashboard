import { Component } from '@angular/core';
import { AuthenticateService } from './authenticate.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(authService: AuthenticateService, private router: Router) {
    if (!authService.isUserLoggedIn()) {
      this.router.navigate(['signin']);
    } else {
      this.router.navigate(['']);
    }
  }
}
