import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeTableComponent } from './attendee-table.component';

describe('AttendeeTableComponent', () => {
  let component: AttendeeTableComponent;
  let fixture: ComponentFixture<AttendeeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendeeTableComponent]
    });
    fixture = TestBed.createComponent(AttendeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
