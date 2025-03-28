import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySummaryComponent } from './salary-summary.component';

describe('SalarySummaryComponent', () => {
  let component: SalarySummaryComponent;
  let fixture: ComponentFixture<SalarySummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalarySummaryComponent]
    });
    fixture = TestBed.createComponent(SalarySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
