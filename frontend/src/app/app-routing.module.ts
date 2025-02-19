import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { path: 'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule), canActivate:[AuthGuard] },

  { 
    path: 'survey', 
    loadChildren: () => import('./features/survey/survey.module').then(m => m.SurveyModule) ,
    canActivate:[AuthGuard]
  },
  { 
    path: 'response', 
    loadChildren: () => import('./features/response/response.module').then(m => m.ResponseModule) ,
    canActivate:[AuthGuard]
  },
  { path: 'analytics', loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule),canActivate:[AuthGuard] },
  { 
    path: '', 
    redirectTo: '/auth/register', 
    pathMatch: 'full' 
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
