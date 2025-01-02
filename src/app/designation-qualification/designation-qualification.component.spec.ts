import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationQualificationComponent } from './designation-qualification.component';

describe('DesignationQualificationComponent', () => {
  let component: DesignationQualificationComponent;
  let fixture: ComponentFixture<DesignationQualificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignationQualificationComponent]
    });
    fixture = TestBed.createComponent(DesignationQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
