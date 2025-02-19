import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../user/dashboard/dashboard.component';
import { ResponseListComponent } from '../response/response-list/response-list.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
  { path: 'response/response-detail/:surveyId', component: ResponseListComponent ,canActivate:[AuthGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }