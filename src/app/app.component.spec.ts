import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {AppComponent} from './app.component';
import {NavComponent} from './shared/layout/nav.component';
import {AppRoutingModule} from './app-routing.module';
import {TaskComponent} from './task/task.component';
import {TaskNewComponent} from './task/new.component';
import {TaskEditComponent} from './task/edit.component';
import {ProjectComponent} from './project/project.component';
import {ProjectNewComponent} from './project/new.component';
import {UserComponent} from './user/user.component';
import {UserNewComponent} from './user/new.component';
import {FilterTaskPipe} from './task/filter-task.pipe';
import {FilterProjectPipe} from './project/filter-project.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormBaseComponent} from './form-base.component';
import {SortProjectPipe} from './project/sort-project.pipe';
import {SortUserPipe} from './user/sort-user.pipe';
import {FilterUserPipe} from './user/filter-user.pipe';
import {BrowserModule, By} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavComponent,
        FormBaseComponent,
        TaskNewComponent,
        TaskComponent,
        ProjectNewComponent,
        ProjectComponent,
        UserComponent,
        UserNewComponent,
        SortProjectPipe,
        FilterProjectPipe,
        SortUserPipe,
        FilterUserPipe,
        FilterTaskPipe,
        TaskEditComponent
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
      providers: [
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    debugElement = fixture.debugElement;
    component = debugElement.componentInstance;
    fixture.detectChanges();
  });

  // it('should create the app', () => {
  //   expect(component).toBeTruthy();
  // });
  //
  // it(`should have title 'angular-project-manager'`, () => {
  //   expect(component.title).toEqual('project-manager-angular');
  // });
  //
  // it(`should render navbar'`, () => {
  //   // const navbar = nativeElement.querySelector('app-layout-nav');
  //   const navbar = debugElement.queryAllNodes(By.css('app-layout-nav'));
  //   expect(navbar.length).toEqual(1);
  // });
});
