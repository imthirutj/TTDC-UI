import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionProfileComponent } from './institution-profile.component';

describe('InstitutionProfileComponent', () => {
  let component: InstitutionProfileComponent;
  let fixture: ComponentFixture<InstitutionProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstitutionProfileComponent]
    });
    fixture = TestBed.createComponent(InstitutionProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
