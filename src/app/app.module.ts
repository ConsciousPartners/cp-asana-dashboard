import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProjectsModule } from './projects/projects.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { SigninComponent } from './signin/signin.component';
import { RouterModule } from '@angular/router';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angular-6-social-login';
import { ProjectsComponent } from './projects/projects.component';
import { StorageServiceModule } from 'angular-webstorage-service';

// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [{
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.googleClientId)
    }]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ProjectsModule,
    SocialLoginModule,
    StorageServiceModule,
    RouterModule.forRoot([
      { path: '', component: ProjectsComponent },
      { path: 'signin', component: SigninComponent }
    ]),
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
