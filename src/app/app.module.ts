import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './shared/layout/nav.component';
import { TaskComponent } from './task/task.component';
import { FormBaseComponent } from './form-base.component';
import { ProjectComponent } from './project/project.component';
import { UserComponent } from './user/user.component';
import { ProjectNewComponent } from './project/new.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {HttpClientModule} from '@angular/common/http';
import {UserNewComponent} from './user/new.component';
import {SortProjectPipe} from './project/sort-project.pipe';
import {FilterProjectPipe} from './project/filter-project.pipe';
import {SortUserPipe} from './user/sort-user.pipe';
import {FilterUserPipe} from './user/filter-user.pipe';
import {TaskNewComponent} from './task/new.component';
import {FilterTaskPipe} from './task/filter-task.pipe';
import {TaskEditComponent} from './task/edit.component';
import {ProjectService} from './services/project.service';

@NgModule({
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
