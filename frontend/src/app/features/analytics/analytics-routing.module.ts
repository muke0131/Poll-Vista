import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyAnalyticsComponent } from './survey-analytics/survey-analytics.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: 'analytics/:surveyId', component: SurveyAnalyticsComponent ,canActivate:[AuthGuard]},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
