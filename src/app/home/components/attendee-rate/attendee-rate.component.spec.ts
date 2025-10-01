import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeRateComponent } from './attendee-rate.component';

describe('AttendeeRateComponent', () => {
  let component: AttendeeRateComponent;
  let fixture: ComponentFixture<AttendeeRateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendeeRateComponent]
    });
    fixture = TestBed.createComponent(AttendeeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
