import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEmployeeLineListComponent } from './dashboard-employee-line-list.component';

describe('DashboardEmployeeLineListComponent', () => {
  let component: DashboardEmployeeLineListComponent;
  let fixture: ComponentFixture<DashboardEmployeeLineListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardEmployeeLineListComponent]
    });
    fixture = TestBed.createComponent(DashboardEmployeeLineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
