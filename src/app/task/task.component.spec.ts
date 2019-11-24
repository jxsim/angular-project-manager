import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComponent } from './task.component';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {AppRoutingModule} from '../app-routing.module';
import {BrowserModule, By} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ProjectService} from '../services/project.service';
import {MockProjectService} from '../mocks/MockProjectService';
import {TaskService} from '../services/task.service';
import {MockTaskService} from '../mocks/MockTaskService';
import {UserService} from '../services/user.service';
import {MockUserService} from '../mocks/MockUserService';
import {TaskNewComponent} from './new.component';
import {UserComponent} from '../user/user.component';
import {SortProjectPipe} from '../project/sort-project.pipe';
import {SortUserPipe} from '../user/sort-user.pipe';
import {FilterProjectPipe} from '../project/filter-project.pipe';
import {FilterTaskPipe} from './filter-task.pipe';
import {FilterUserPipe} from '../user/filter-user.pipe';
import {TaskEditComponent} from './edit.component';
import {ProjectComponent} from '../project/project.component';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskComponent, TaskNewComponent, TaskEditComponent,
        ProjectComponent,
        UserComponent,
        SortProjectPipe, SortUserPipe,
        FilterProjectPipe, FilterTaskPipe, FilterUserPipe
      ],
      imports: [
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: UserService, useClass: MockUserService },
        { provide: ProjectService, useClass: MockProjectService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('List group of tasks', () => {
    it('should render tasks with correct details', () => {
      const tasks = debugElement.queryAllNodes(By.css('li.list-group-item'));

      const taskOne = tasks[0] as DebugElement;
      const taskTwo = tasks[1] as DebugElement;
      const taskThree = tasks[2] as DebugElement;
      expect(tasks.length).toEqual(3);

      const taskOneTitle = taskOne.nativeElement.querySelector('h5');
      const taskOneStatus = taskOne.nativeElement.querySelector('span.badge');
      expect(taskOneTitle.innerText).toEqual('t1');
      expect(taskOneStatus.innerText).toEqual('Ongoing');

      const taskTwoTitle = taskTwo.nativeElement.querySelector('h5');
      const taskTwoStatus = taskTwo.nativeElement.querySelector('span.badge');
      expect(taskTwoTitle.innerText).toEqual('t2');
      expect(taskTwoStatus.innerText).toContain('Completed');

      const taskThreeTitle = taskThree.nativeElement.querySelector('h5');
      const taskThreeStatus = taskThree.nativeElement.querySelector('span.badge');
      expect(taskThreeTitle.innerText).toEqual('t44');
      expect(taskThreeStatus.innerText).toEqual('Ongoing');
    });
  });
});
