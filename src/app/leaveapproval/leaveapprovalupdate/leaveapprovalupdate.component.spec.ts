import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveapprovalupdateComponent } from './leaveapprovalupdate.component';

describe('LeaveapprovalupdateComponent', () => {
  let component: LeaveapprovalupdateComponent;
  let fixture: ComponentFixture<LeaveapprovalupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveapprovalupdateComponent]
    });
    fixture = TestBed.createComponent(LeaveapprovalupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
