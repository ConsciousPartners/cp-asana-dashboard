import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsService } from './projects.service';
import { ProjectsComponent } from './projects.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProjectsComponent
  ],
  providers: [ProjectsService],
  exports: [ProjectsComponent]
})
export class ProjectsModule { }
