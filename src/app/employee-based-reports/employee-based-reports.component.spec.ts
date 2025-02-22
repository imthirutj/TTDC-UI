import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBasedReportsComponent } from './employee-based-reports.component';

describe('EmployeeBasedReportsComponent', () => {
  let component: EmployeeBasedReportsComponent;
  let fixture: ComponentFixture<EmployeeBasedReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeBasedReportsComponent]
    });
    fixture = TestBed.createComponent(EmployeeBasedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
