import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { StorageService } from 'angular-webstorage-service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

  constructor( private socialAuthService: AuthService, private router: Router ) {}

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'google'){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        localStorage.setItem('USER_DATA', JSON.stringify(userData));
        this.router.navigate(['']);
      }
    );
  }

  ngOnInit() {
  }

}
