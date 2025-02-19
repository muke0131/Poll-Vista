import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ResponseDetailComponent} from './response-detail/response-detail.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ResponseListComponent } from './response-list/response-list.component';
const routes: Routes = [
  { path: 'response-detail/:responseId', component: ResponseDetailComponent,canActivate:[AuthGuard] },
  { path: 'response-list/:surveyId', component: ResponseListComponent,canActivate:[AuthGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ResponseRoutingModule { }