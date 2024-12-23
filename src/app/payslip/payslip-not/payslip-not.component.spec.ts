import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipNotComponent } from './payslip-not.component';

describe('PayslipNotComponent', () => {
  let component: PayslipNotComponent;
  let fixture: ComponentFixture<PayslipNotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayslipNotComponent]
    });
    fixture = TestBed.createComponent(PayslipNotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
