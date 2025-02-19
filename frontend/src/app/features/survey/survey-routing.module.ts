// survey-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { TakeSurveyComponent } from './take-survey/take-survey.component';
import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PreviewSurveyComponent } from './preview-survey/preview-survey.component';

const routes: Routes = [
    { path: 'create-survey', component: CreateSurveyComponent,canActivate:[AuthGuard]  },
    { path: 'take-survey/:id', component: TakeSurveyComponent ,canActivate:[AuthGuard] }, 
    { path: 'edit-survey/:id', component: EditSurveyComponent,canActivate:[AuthGuard]  }, 
    { path: 'survey/preview-survey/:id', component: PreviewSurveyComponent ,canActivate:[AuthGuard]},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
