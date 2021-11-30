/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SetUpCompanyVariationOptionsComponent } from './set-up-company-variation-options.component';

describe('SetUpCompanyVariationOptionsComponent', () => {
  let component: SetUpCompanyVariationOptionsComponent;
  let fixture: ComponentFixture<SetUpCompanyVariationOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetUpCompanyVariationOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpCompanyVariationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
