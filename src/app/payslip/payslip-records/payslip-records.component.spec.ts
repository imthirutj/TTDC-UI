import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipRecordsComponent } from './payslip-records.component';

describe('PayslipRecordsComponent', () => {
  let component: PayslipRecordsComponent;
  let fixture: ComponentFixture<PayslipRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayslipRecordsComponent]
    });
    fixture = TestBed.createComponent(PayslipRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
