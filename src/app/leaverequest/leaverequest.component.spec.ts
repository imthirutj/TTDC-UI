import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaverequestComponent } from './leaverequest.component';

describe('LeaverequestComponent', () => {
  let component: LeaverequestComponent;
  let fixture: ComponentFixture<LeaverequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaverequestComponent]
    });
    fixture = TestBed.createComponent(LeaverequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
