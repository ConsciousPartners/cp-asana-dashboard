import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './projects.service';
import { TasksService } from './../tasks/tasks.service';
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

  constructor(private _projectsService: ProjectsService, private _tasksService: TasksService) { }

  ngOnInit() {
    this.prepareDatesHeader();

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
        if (this.projects.hasOwnProperty('data')) {
          this.projects.data.forEach((data, index) => {
            this._tasksService.getTasks(data.id).subscribe(
              tasks => this.tasks = tasks,
              err => {
                console.log(err);
              },
              () => {
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(today.getDate() - 1);

                  this.tasks.data.forEach(element => {
                    const d = new Date(element.due_on);
                    element.day = d.getDate();
                    element.month = d.getMonth() + 1;
                    element.year = d.getFullYear();
                  });
                  const tasksCompletedSinceYesterday = [];

                  this.projects.data[index].tasksCompleted = this.tasks.data.filter(task => task.completed === true);
                  this.projects.data[index].tasksIncomplete = this.tasks.data.filter(task => task.completed === false);
                  this.projects.data[index].tasksAll = this.tasks.data;
                  this.tasks.data.filter(task => {
                    const due = new Date(task.due_on);
                    if (due <= yesterday && task.completed === true) {
                      tasksCompletedSinceYesterday.push(task);
                    }
                  });
                  let maxDue = new Date();
                  this.tasks.data.filter(task => {
                    const due = new Date(task.due_on);
                    if (due >= maxDue) {
                      maxDue = due;
                    }
                  });

                  const taskCompletedSize = this.projects.data[index].tasksCompleted.length;
                  const zeroTasks = taskCompletedSize === 0 && tasksCompletedSinceYesterday.length === 0;
                  const taskComplated = taskCompletedSize >= tasksCompletedSinceYesterday.length;

                  this.projects.data[index].isComplete = taskComplated && !zeroTasks ? true : false;
                  this.projects.data[index].calendarDays = this.prepareTaskCountByDate(this.projects.data[index].tasksAll, maxDue);
              }
            );

          });
        }
    });
  }

  prepareTaskCountByDate(taskAll, maxDue) {
    maxDue.setHours(0, 0, 0, 0);
    const today = new Date();
    const yesterday = new Date(today);
    const threeMonths = new Date(today);
    const calendarDays = [];
    let currentSum = 0;
    yesterday.setDate(today.getDate() - 1);
    threeMonths.setDate(today.getDate() + 90);

    for (const d = yesterday; d <= threeMonths; d.setDate(d.getDate() + 1)) {
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
    const today = new Date();
    const yesterday = new Date(today);
    const threeMonths = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    threeMonths.setDate(today.getDate() + 90);

    for (const d = yesterday; d <= threeMonths; d.setDate(d.getDate() + 1)) {
      const dateNow = d.getDate();
      const monthNow =  d.getMonth() + 1;
      const yearNow = d.getFullYear();

      this.calendarDays.push({ day : dateNow.toString() });
    }
  }
}
