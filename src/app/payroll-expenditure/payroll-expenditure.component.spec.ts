import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollExpenditureComponent } from './payroll-expenditure.component';

describe('PayrollExpenditureComponent', () => {
  let component: PayrollExpenditureComponent;
  let fixture: ComponentFixture<PayrollExpenditureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollExpenditureComponent]
    });
    fixture = TestBed.createComponent(PayrollExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
