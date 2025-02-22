import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAndOdAnalysisComponent } from './leave-and-od-analysis.component';

describe('LeaveAndOdAnalysisComponent', () => {
  let component: LeaveAndOdAnalysisComponent;
  let fixture: ComponentFixture<LeaveAndOdAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveAndOdAnalysisComponent]
    });
    fixture = TestBed.createComponent(LeaveAndOdAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
