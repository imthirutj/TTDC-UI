import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerPaginationComponent } from './server-pagination.component';

describe('ServerPaginationComponent', () => {
  let component: ServerPaginationComponent;
  let fixture: ComponentFixture<ServerPaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServerPaginationComponent]
    });
    fixture = TestBed.createComponent(ServerPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
