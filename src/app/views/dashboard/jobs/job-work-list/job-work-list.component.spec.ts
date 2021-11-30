/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JobWorkListComponent } from './job-work-list.component';

describe('JobWorkListComponent', () => {
  let component: JobWorkListComponent;
  let fixture: ComponentFixture<JobWorkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobWorkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobWorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
