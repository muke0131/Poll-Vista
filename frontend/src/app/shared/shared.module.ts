import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './pipes/filter.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';



@NgModule({
  declarations: [
    FilterPipe,
    HighlightDirective,
    // NavbarComponent,
    // HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  // exports: [
  //   HeaderComponent
  // ]
})
export class SharedModule { }
