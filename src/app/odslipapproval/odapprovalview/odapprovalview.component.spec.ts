import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdapprovalviewComponent } from './odapprovalview.component';

describe('OdapprovalviewComponent', () => {
  let component: OdapprovalviewComponent;
  let fixture: ComponentFixture<OdapprovalviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OdapprovalviewComponent]
    });
    fixture = TestBed.createComponent(OdapprovalviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
