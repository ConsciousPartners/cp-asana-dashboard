import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsService } from './projects.service';
import { ProjectsComponent } from './projects.component';
import { TasksModule } from './../tasks/tasks.module';

@NgModule({
  imports: [
    CommonModule,
    TasksModule
  ],
  declarations: [
    ProjectsComponent
  ],
  providers: [ProjectsService],
  exports: [ProjectsComponent]
})
export class ProjectsModule { }
