/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SuperProductsPicksComponent } from './super-products-picks.component';

describe('SuperProductsPicksComponent', () => {
  let component: SuperProductsPicksComponent;
  let fixture: ComponentFixture<SuperProductsPicksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperProductsPicksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperProductsPicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
