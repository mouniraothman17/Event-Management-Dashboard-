import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsSummaryComponent } from './metrics-summary.component';

describe('MetricsSummaryComponent', () => {
  let component: MetricsSummaryComponent;
  let fixture: ComponentFixture<MetricsSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetricsSummaryComponent]
    });
    fixture = TestBed.createComponent(MetricsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
