import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SurveyModule } from './features/survey/survey.module';
import { UserModule } from './features/user/user.module';
import { ResponseModule } from './features/response/response.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CookieService } from 'ngx-cookie-service'; 
import { AnalyticsModule } from './features/analytics/analytics.module';
import {MatSnackBarModule} from '@angular/material/snack-bar'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SurveyModule,
    UserModule,
    ResponseModule,
  CoreModule,
  HttpClientModule,
  BrowserAnimationsModule,
  AppRoutingModule,
  MatSnackBarModule,
  MatCardModule, 
  MatProgressSpinnerModule, 
    AppRoutingModule,
    AnalyticsModule,


  ],providers: [
    { 
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true,
     },CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }