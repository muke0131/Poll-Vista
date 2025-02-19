import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyAnalyticsComponent } from './survey-analytics/survey-analytics.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AnalyticsRoutingModule } from './analytics-routing.module';

@NgModule({
  declarations: [
    SurveyAnalyticsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxChartsModule, 
    AnalyticsRoutingModule
  ],
  exports: [SurveyAnalyticsComponent] 

})
export class AnalyticsModule { }