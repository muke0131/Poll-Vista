import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseListComponent } from './response-list/response-list.component';
import { ResponseDetailComponent } from './response-detail/response-detail.component';
import { ResponseRoutingModule } from './response-routing.module';



@NgModule({
  declarations: [
    ResponseListComponent,
    ResponseDetailComponent
  ],
  imports: [
    CommonModule,ResponseRoutingModule
  ]
})
export class ResponseModule { }
