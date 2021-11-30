/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DashbreadComponent } from './dashbread.component';

describe('DashbreadComponent', () => {
  let component: DashbreadComponent;
  let fixture: ComponentFixture<DashbreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashbreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
