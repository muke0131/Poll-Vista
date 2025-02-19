import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyRoutingModule } from './survey-routing.module';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { TakeSurveyComponent } from './take-survey/take-survey.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { PreviewSurveyComponent } from './preview-survey/preview-survey.component';

@NgModule({
  declarations: [
    CreateSurveyComponent,
    TakeSurveyComponent,
    EditSurveyComponent,
    PreviewSurveyComponent
  ],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    ReactiveFormsModule,
  ]
})
export class SurveyModule { }
