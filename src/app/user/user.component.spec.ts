import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserComponent} from './user.component';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {SortUserPipe} from './sort-user.pipe';
import {FilterUserPipe} from './filter-user.pipe';
import {AppRoutingModule} from '../app-routing.module';
import {BrowserModule, By} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TaskComponent} from '../task/task.component';
import {TaskNewComponent} from '../task/new.component';
import {TaskEditComponent} from '../task/edit.component';
import {SortProjectPipe} from '../project/sort-project.pipe';
import {FilterProjectPipe} from '../project/filter-project.pipe';
import {FilterTaskPipe} from '../task/filter-task.pipe';
import {UserService} from '../services/user.service';
import {MockUserService} from '../mocks/MockUserService';
import {ProjectComponent} from '../project/project.component';

@Component({selector: 'app-user-new', template: ''})
class UserNewStubComponent {}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserComponent,
        UserNewStubComponent,
        TaskComponent, TaskNewComponent, TaskEditComponent,
        ProjectComponent,
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
        { provide: UserService, useClass: MockUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it ('should have a search field to filter users', () => {
    const searchField = debugElement.queryAllNodes(By.css('input#search-task-desc'));
    expect(searchField.length).toEqual(1);
  });

  describe('List group of users', () => {
    it('should render projects with correct details', () => {
      const users = debugElement.queryAllNodes(By.css('li.list-group-item'));

      const userOne = users[0] as DebugElement;
      const userTwo = users[1] as DebugElement;
      expect(users.length).toEqual(2);

      const userOneTitle = userOne.nativeElement.querySelector('h5');
      expect(userOneTitle.innerText).toEqual('u1');

      const userTwoTitle = userTwo.nativeElement.querySelector('h5');
      expect(userTwoTitle.innerText).toEqual('u3');
    });
  });
});
