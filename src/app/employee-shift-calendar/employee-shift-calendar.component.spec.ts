import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeShiftCalendarComponent } from './employee-shift-calendar.component';

describe('EmployeeShiftCalendarComponent', () => {
  let component: EmployeeShiftCalendarComponent;
  let fixture: ComponentFixture<EmployeeShiftCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeShiftCalendarComponent]
    });
    fixture = TestBed.createComponent(EmployeeShiftCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
