import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdslipComponent } from './odslip.component';

describe('OdslipComponent', () => {
  let component: OdslipComponent;
  let fixture: ComponentFixture<OdslipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OdslipComponent]
    });
    fixture = TestBed.createComponent(OdslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
