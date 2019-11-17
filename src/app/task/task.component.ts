import { Component, OnInit } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {API} from '../helpers/api-helper';
import Task from '../models/task';
import {TaskService} from '../services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks: Task[];
  search = '';
  taskToUpdate: Task;
  sortEvent: string;

  constructor(private fb: FormBuilder, private taskService: TaskService) { }

  ngOnInit() {
    this.getTasks();
  }

  onDataEvent(dataEvent) {
    const { action, data } = dataEvent;
    if (action === 'create') {
      this.tasks = [...this.tasks, data];
    } else if (action === 'update') {
      const task = this.tasks.find(p => p.id === data.id);
      Object.assign(task, data);
    }
  }

  getTasks(): void {
    const cb = resp => {
      if (resp) {
        this.tasks = resp['data'].map(t => {
          return { id: t.id, ...t.attributes } as Task;
        });
      }
    };
    API.handleGetAll(this.taskService, cb);
  }

  onEdit(id) {
    window.scrollTo(0, 0);
    this.taskToUpdate = Object.assign({}, this.tasks.find(p => p.id === id));
  }

  onSort(sortEvent) {
    this.sortEvent = sortEvent;
  }
}
