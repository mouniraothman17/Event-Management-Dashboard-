import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsSectionComponent } from './events-section.component';

describe('EventsSectionComponent', () => {
  let component: EventsSectionComponent;
  let fixture: ComponentFixture<EventsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsSectionComponent]
    });
    fixture = TestBed.createComponent(EventsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
