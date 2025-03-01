import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampePageComponent } from './sampe-page.component';

describe('SampePageComponent', () => {
  let component: SampePageComponent;
  let fixture: ComponentFixture<SampePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampePageComponent]
    });
    fixture = TestBed.createComponent(SampePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
