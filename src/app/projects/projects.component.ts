import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './projects.service';
import { IProjects } from './projects';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  interval;
  projects: IProjects[] = [];
  constructor(private _projectsService: ProjectsService) { }

  ngOnInit(): void {
    if (typeof this.interval === 'undefined') {
      this.checkUpdates();
    }
    this.interval = setInterval(() => {
      this.checkUpdates();
    }, 1000 * 60);
  }

  checkUpdates() {
    this._projectsService.getProjects().subscribe(data => {
      this.projects = data.data;
    });
  }
}
