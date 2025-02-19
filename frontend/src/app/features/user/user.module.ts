import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRoutingModule } from './user-routing.module';
import { DeleteSurveyComponent } from './dashboard/delete-survey/delete-survey.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SurveyCardComponent } from './dashboard/survey-card/survey-card.component';
 

@NgModule({
  declarations: [
    DashboardComponent,
    DeleteSurveyComponent,
    SurveyCardComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatDialogModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule, 
  ]
})
export class UserModule { }
 
 