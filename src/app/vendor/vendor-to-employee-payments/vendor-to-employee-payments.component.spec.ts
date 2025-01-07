import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorToEmployeePaymentsComponent } from './vendor-to-employee-payments.component';

describe('VendorToEmployeePaymentsComponent', () => {
  let component: VendorToEmployeePaymentsComponent;
  let fixture: ComponentFixture<VendorToEmployeePaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorToEmployeePaymentsComponent]
    });
    fixture = TestBed.createComponent(VendorToEmployeePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
