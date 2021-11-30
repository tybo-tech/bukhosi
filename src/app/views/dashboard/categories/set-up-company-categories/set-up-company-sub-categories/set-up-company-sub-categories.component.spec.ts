/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SetUpCompanySubCategoriesComponent } from './set-up-company-sub-categories.component';

describe('SetUpCompanySubCategoriesComponent', () => {
  let component: SetUpCompanySubCategoriesComponent;
  let fixture: ComponentFixture<SetUpCompanySubCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetUpCompanySubCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpCompanySubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
