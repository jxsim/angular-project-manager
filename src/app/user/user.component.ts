import { Component, OnInit } from '@angular/core';
import User from '../models/user';
import {UserService} from '../services/user.service';
import {API} from '../helpers/api-helper';
import Project from '../models/project';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  sortEvent: string;
  search: string;
  users: User[];
  userToUpdate: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    const cb = (resp) => {
      this.users = resp['data'].map(t => {
        return { id: t.id, ...t.attributes } as User;
      });
    };
    API.handleGetAll(this.userService, cb);
  }

  onDataEvent(dataEvent) {
    const { action, data } = dataEvent;
    if (action === 'create') {
      this.users = [...this.users, data];
    } else if (action === 'update') {
      const user = this.users.find(u => u.id === data.id);
      Object.assign(user, data);
    }
  }

  onEdit(id) {
    window.scrollTo(0, 0);
    this.userToUpdate = Object.assign({}, this.users.find(u => u.id === id));
  }

  onDelete(id) {
    const cb = response => {
      if (response['data']) {
        this.users = this.users.filter(p => p.id !== response['data'].id);
      }
    };
    API.handleDelete(this.userService, { id }, cb);
  }

  onSort(sortEvent) {
    this.sortEvent = sortEvent;
  }

}
