/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SuperListProductComponent } from './super-list-product.component';

describe('SuperListProductComponent', () => {
  let component: SuperListProductComponent;
  let fixture: ComponentFixture<SuperListProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperListProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
