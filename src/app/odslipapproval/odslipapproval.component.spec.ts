import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdslipapprovalComponent } from './odslipapproval.component';

describe('OdslipapprovalComponent', () => {
  let component: OdslipapprovalComponent;
  let fixture: ComponentFixture<OdslipapprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OdslipapprovalComponent]
    });
    fixture = TestBed.createComponent(OdslipapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
