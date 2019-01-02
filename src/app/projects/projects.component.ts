import { Component, OnInit } from '@angular/core';

import { ProjectsService } from './projects.service';
import { IProjects } from './projects';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

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
            const pstTime = momentTz.tz(today, 'America/Los_Angeles').subtract(1, 'days');
            let maxTaskDue = moment(this.projects.minimumDue).toDate();

            project.tasks.data.forEach(element => {
              if (element.due_on !== null) {
                const d = moment(element.due_on).toDate();
                d.setHours(0, 0, 0, 0);
                element.day = d.getDate();
                element.month = d.getMonth() + 1;
                element.year = d.getFullYear();
                if (d > maxTaskDue) {
                  maxTaskDue = d;
                }
              }
            });
            const tasksCompletedSinceYesterday = [];

            this.projects.data[index].maxTaskDue = maxTaskDue;
            this.projects.data[index].tasksCompleted = project.tasks.data.filter(task => task.due_on !== null && task.completed === true);
            this.projects.data[index].tasksIncomplete = project.tasks.data.filter(task => task.due_on !== null && task.completed === false);
            this.projects.data[index].tasksAll = project.tasks.data;

            project.tasks.data.filter(task => {
              if (task.due_on !== null) {
                const due = moment(task.due_on).toDate();
                due.setHours(0, 0, 0, 0);
                if (moment(due).format('YYYY/MM/DD') <= pstTime.format('YYYY/MM/DD')) {
                  tasksCompletedSinceYesterday.push(task);
                }
              }
            });

            this.projects.data[index].tasksCompletedSinceYesterday = tasksCompletedSinceYesterday;

            const taskCompletedSize = this.projects.data[index].tasksCompleted.length;
            const zeroTasks = taskCompletedSize === 0 && tasksCompletedSinceYesterday.length === 0;
            const taskCompleted = taskCompletedSize >= tasksCompletedSinceYesterday.length;

            this.projects.data[index].isComplete = (taskCompleted && !zeroTasks) || zeroTasks ? true : false;
            this.projects.data[index].calendarDays = this.prepareTaskCountByDate(this.projects.data[index].tasksAll, maxTaskDue);
          });
          this.prepareDatesHeader();
        }
    });

  }

  prepareTaskCountByDate(taskAll, maxTaxDue) {
    const maxDue = moment(this.projects.maximumDue).toDate();
    const minDue = moment(this.projects.minimumDue).toDate();
    maxDue.setHours(0, 0, 0, 0);
    minDue.setHours(0, 0, 0, 0);

    const today = new Date();
    const minDueDate = moment(minDue).toDate();
    const pstTime = momentTz.tz(today, 'America/Los_Angeles').subtract(1, 'days');

    let defaultMax = pstTime;
    defaultMax = moment(defaultMax).toDate();
    defaultMax = moment(defaultMax).add('days', 90).toDate();

    let threeMonths = moment(defaultMax).toDate();

    if (maxDue > defaultMax) {
      threeMonths = moment(maxDue).toDate();
    }    

    const calendarDays = [];
    let currentSum = 0;

    for (const d = minDueDate; d <= threeMonths; d.setDate(d.getDate() + 1)) {
      d.setHours(0, 0, 0, 0);
      const dateNow = d.getDate();
      const monthNow =  d.getMonth() + 1;
      const yearNow = d.getFullYear();
      let taskCount;

      const taskCountShow = (d <= maxTaxDue) ? true : false;

      const dMoment = moment(d).format('YYYY/MM/DD');
      taskCount = taskAll.filter(task => (task.due_on !== null
        && task.day === dateNow
        && task.month === monthNow
        && task.year === yearNow));
      currentSum = taskCount.length + currentSum;

      if (dMoment >= pstTime.format('YYYY/MM/DD')) {
        calendarDays.push({
          day : dateNow.toString(),
          taskCount : currentSum,
          isWeekend : (d.getDay() === 6 || d.getDay() === 0),
          show: taskCountShow
        });
      }
    }
    return calendarDays;
  }

  prepareDatesHeader() {
    this.calendarDays = [];
    const maxDue = moment(this.projects.maximumDue).toDate();
    const minDue = moment(this.projects.minimumDue).toDate();
    maxDue.setHours(0, 0, 0, 0);
    minDue.setHours(0, 0, 0, 0);

    const today = new Date();
    const minDueDate = moment(minDue).toDate();
    const pstTime = momentTz.tz(today, 'America/Los_Angeles').subtract(1, 'days');

    let defaultMax = pstTime;
    defaultMax = moment(defaultMax).toDate();
    defaultMax = moment(defaultMax).add('days', 90).toDate();

    let threeMonths = moment(defaultMax).toDate();

    if (maxDue > defaultMax) {
      threeMonths = moment(maxDue).toDate();
    }

    for (const d = minDueDate; d <= threeMonths; d.setDate(d.getDate() + 1)) {
      const dMoment = moment(d).format('YYYY/MM/DD');
      const dateNow = d.getDate();
      const monthNow =  d.getMonth() + 1;
      const yearNow = d.getFullYear();

      if (dMoment >= pstTime.format('YYYY/MM/DD')) {
        this.calendarDays.push({ day : dateNow.toString() });
      }
    }
  }
}
