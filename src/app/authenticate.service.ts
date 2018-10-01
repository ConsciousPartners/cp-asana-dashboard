import { Injectable } from '@angular/core';
import {
  AuthService,
  GoogleLoginProvider
} from 'angular-6-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  socialUser = <any>{};
  constructor(private socialAuthService: AuthService) { }

  isUserLoggedIn() {
    const userData = localStorage.getItem('USER_DATA');
    if (JSON.parse(userData) === null) {
      return false;
    }

    return true;
  }
}
