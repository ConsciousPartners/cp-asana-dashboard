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
  projects = <any>{};

  tasks = <any>{};
  tasksCompleted = <any>{};
  tasksIncomplete = <any>{};
  tasksAll = <any>{};

  calendarDays = [];

  isComplete = false;

  constructor(private _projectsService: ProjectsService) { }

  ngOnInit() {
    if (typeof this.interval === 'undefined') {
      this.checkUpdates();
    }
    this.interval = setInterval(() => {
      this.checkUpdates();
    }, 1000 * 60);
  }

  checkUpdates(): void {
    this._projectsService.getProjects()
    .subscribe(
      projects => this.projects = projects,
      err => {
        console.log(err);
      },
      () => {
        const allTasks = [];
        if (this.projects.hasOwnProperty('data')) {
          this.projects.data.forEach((project, index) => {

            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            project.tasks.data.forEach(element => {
              const d = new Date(element.due_on);
              element.day = d.getDate();
              element.month = d.getMonth() + 1;
              element.year = d.getFullYear();
            });
            const tasksCompletedSinceYesterday = [];

            this.projects.data[index].tasksCompleted = project.tasks.data.filter(task => task.completed === true);
            this.projects.data[index].tasksIncomplete = project.tasks.data.filter(task => task.completed === false);
            this.projects.data[index].tasksAll = project.tasks.data;

            project.tasks.data.filter(task => {
              const due = new Date(task.due_on);
              due.setHours(0, 0, 0, 0);
              if (due <= yesterday && task.completed === false) {
                tasksCompletedSinceYesterday.push(task);
              }
            });

            this.projects.data[index].tasksCompletedSinceYesterday = tasksCompletedSinceYesterday;

            const taskCompletedSize = this.projects.data[index].tasksCompleted.length;
            const zeroTasks = taskCompletedSize === 0 && tasksCompletedSinceYesterday.length === 0;
            const taskCompleted = taskCompletedSize >= tasksCompletedSinceYesterday.length;

            this.projects.data[index].isComplete = taskCompleted && !zeroTasks ? true : false;
            this.projects.data[index].calendarDays = this.prepareTaskCountByDate(this.projects.data[index].tasksAll);
            this.prepareDatesHeader();
          });
        }
    });

  }

  prepareTaskCountByDate(taskAll) {
    const maxDue = new Date(this.projects.maximumDue);
    const minDue = new Date(this.projects.minimumDue);
    maxDue.setHours(0, 0, 0, 0);
    minDue.setHours(0, 0, 0, 0);

    const today = new Date();
    const minDueDate = new Date(minDue);
    const threeMonths = new Date(today);
    const calendarDays = [];
    let currentSum = 0;
    threeMonths.setDate(today.getDate() + 90);

    for (const d = minDueDate; d <= threeMonths; d.setDate(d.getDate() + 1)) {
      d.setHours(0, 0, 0, 0);
      const dateNow = d.getDate();
      const monthNow =  d.getMonth() + 1;
      const yearNow = d.getFullYear();
      let taskCount;

      const taskCountShow = (d <= maxDue) ? true : false;

      taskCount = taskAll.filter(task => (task.day === dateNow && task.month === monthNow && task.year === yearNow));
      currentSum = taskCount.length + currentSum;

      calendarDays.push({
        day : dateNow.toString(),
        taskCount : currentSum,
        isWeekend : (d.getDay() === 6 || d.getDay() === 0),
        show: taskCountShow
      });
    }
    return calendarDays;
  }

  prepareDatesHeader() {
    const maxDue = new Date(this.projects.maximumDue);
    const minDue = new Date(this.projects.minimumDue);
    maxDue.setHours(0, 0, 0, 0);
    minDue.setHours(0, 0, 0, 0);

    const today = new Date();
    const minDueDate = new Date(minDue);
    const threeMonths = new Date(today);
    threeMonths.setDate(today.getDate() + 90);

    for (const d = minDueDate; d <= threeMonths; d.setDate(d.getDate() + 1)) {
      const dateNow = d.getDate();
      const monthNow =  d.getMonth() + 1;
      const yearNow = d.getFullYear();

      this.calendarDays.push({ day : dateNow.toString() });
    }
  }
}
