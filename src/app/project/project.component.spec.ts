import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectComponent} from './project.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SortProjectPipe} from './sort-project.pipe';
import {FilterProjectPipe} from './filter-project.pipe';
import {AppRoutingModule} from '../app-routing.module';
import {BrowserModule, By} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {TaskComponent} from '../task/task.component';
import {TaskNewComponent} from '../task/new.component';
import {TaskEditComponent} from '../task/edit.component';
import {UserComponent} from '../user/user.component';
import {FilterTaskPipe} from '../task/filter-task.pipe';
import {FilterUserPipe} from '../user/filter-user.pipe';
import {SortUserPipe} from '../user/sort-user.pipe';
import {ProjectService} from '../services/project.service';
import {MockProjectService} from '../mocks/MockProjectService';

@Component({selector: 'app-project-new', template: ''})
class ProjectNewStubComponent {}

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectComponent,
        ProjectNewStubComponent,
        TaskComponent, TaskNewComponent, TaskEditComponent,
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
        { provide: ProjectService, useClass: MockProjectService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it ('should have a search field to filter projects', () => {
    const searchField = debugElement.queryAllNodes(By.css('input#search-task-desc'));
    expect(searchField.length).toEqual(1);
  });

  describe('List group of projects', () => {
    it('should render projects with correct details', () => {
      const projects = debugElement.queryAllNodes(By.css('li.list-group-item'));

      const projectOne = projects[0] as DebugElement;
      const projectTwo = projects[1] as DebugElement;
      expect(projects.length).toEqual(2);

      const projectOneTitle = projectOne.nativeElement.querySelector('h5');
      const projectOneStatus = projectOne.nativeElement.querySelector('span.badge');
      expect(projectOneTitle.innerText).toEqual('p1');
      expect(projectOneStatus.innerText).toEqual('Completed');

      const projectTwoTitle = projectTwo.nativeElement.querySelector('h5');
      const projectTwoStatus = projectTwo.nativeElement.querySelector('span.badge');
      expect(projectTwoTitle.innerText).toEqual('p2');
      expect(projectTwoStatus.innerText).toEqual('Ongoing');
    });
  });
});
