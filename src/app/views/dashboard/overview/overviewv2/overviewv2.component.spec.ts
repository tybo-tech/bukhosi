/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Overviewv2Component } from './overviewv2.component';

describe('Overviewv2Component', () => {
  let component: Overviewv2Component;
  let fixture: ComponentFixture<Overviewv2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Overviewv2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Overviewv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
