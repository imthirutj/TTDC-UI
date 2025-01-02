import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveapprovalComponent } from './leaveapproval.component';

describe('LeaveapprovalComponent', () => {
  let component: LeaveapprovalComponent;
  let fixture: ComponentFixture<LeaveapprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveapprovalComponent]
    });
    fixture = TestBed.createComponent(LeaveapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
