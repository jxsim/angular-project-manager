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
import {ProjectFilterPipe} from './project/filter.pipe';
import {ProjectSortPipe} from './project/sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FormBaseComponent,
    TaskComponent,
    ProjectComponent,
    UserComponent,
    ProjectNewComponent,
    ProjectFilterPipe,
    ProjectSortPipe
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
