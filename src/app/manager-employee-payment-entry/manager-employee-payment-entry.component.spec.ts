import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerEmployeePaymentEntryComponent } from './manager-employee-payment-entry.component';

describe('ManagerEmployeePaymentEntryComponent', () => {
  let component: ManagerEmployeePaymentEntryComponent;
  let fixture: ComponentFixture<ManagerEmployeePaymentEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerEmployeePaymentEntryComponent]
    });
    fixture = TestBed.createComponent(ManagerEmployeePaymentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
