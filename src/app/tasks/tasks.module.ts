import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TasksComponent],
  exports: [TasksComponent]
})
export class TasksModule { }
