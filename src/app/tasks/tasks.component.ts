import { Component, OnInit, Input } from '@angular/core';

import { TasksService } from './tasks.service';
import { ITasks } from './tasks';

@Component({
  selector: '[app-tasks]',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @Input() projectId: string;

  tasksCompleted: ITasks[] = [];
  tasksIncomplete: ITasks[] = [];
  tasksAll: ITasks[] = [];
  isComplete = false;
  calendarDays = [];
  constructor(private _tasksService: TasksService) { }

  ngOnInit() {
    this._tasksService.getTasks(this.projectId).subscribe(data => {
      data.data.forEach(element => {
        const d = new Date(element.due_on);
        element.day = d.getDate();
        element.month = d.getMonth() + 1;
        element.year = d.getFullYear();
      });
      this.tasksCompleted = data.data.filter(task => task.completed === true);
      this.tasksIncomplete = data.data.filter(task => task.completed === false);
      this.tasksAll = data.data;
      this.isComplete = (this.tasksIncomplete.length === 0) ? true : false;
      this.prepareDates();
    });

  }

  prepareDates() {
    const today = new Date();
    const yesterday = new Date(today);
    const threeMonths = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    threeMonths.setDate(today.getDate() + 90);

    for (const d = yesterday; d <= threeMonths; d.setDate(d.getDate() + 1)) {
      const dateNow = d.getDate();
      const monthNow =  d.getMonth() + 1;
      const yearNow = d.getFullYear();
      console.log();

      this.calendarDays.push({ day : dateNow.toString(), taskCount : this.tasksAll.filter(task => 
        (task.day === dateNow && task.month === monthNow && task.year === yearNow)).length });
    }
  }

}
