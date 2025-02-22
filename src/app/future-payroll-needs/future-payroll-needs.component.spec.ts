import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturePayrollNeedsComponent } from './future-payroll-needs.component';

describe('FuturePayrollNeedsComponent', () => {
  let component: FuturePayrollNeedsComponent;
  let fixture: ComponentFixture<FuturePayrollNeedsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FuturePayrollNeedsComponent]
    });
    fixture = TestBed.createComponent(FuturePayrollNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
