import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfGenerationReportComponent } from './pf-generation-report.component';

describe('PfGenerationReportComponent', () => {
  let component: PfGenerationReportComponent;
  let fixture: ComponentFixture<PfGenerationReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PfGenerationReportComponent]
    });
    fixture = TestBed.createComponent(PfGenerationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
