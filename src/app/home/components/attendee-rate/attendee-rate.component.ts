import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { AttendeesService } from 'src/app/attendees.service';

@Component({
  selector: 'app-attendee-rate',
  templateUrl: './attendee-rate.component.html',
  styleUrls: ['./attendee-rate.component.css']
})
export class AttendeeRateComponent implements OnInit {
  @Input() eventId!: number;
  @Input() fromHome: boolean = false; // نحدد الصفحة

  public doughnutChartLabels: string[] = ['Attended', 'Missed'];
  public doughnutChartData: any;
  public doughnutChartType: 'doughnut' = 'doughnut';
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  attendeeRate: number = 0;

  constructor(private attendeesService: AttendeesService) {}

  ngOnInit() {
    if (this.fromHome) {
      this.attendeesService.getHomeAttendeeRate().subscribe({
        next: (res: { percentage: string }) => {
          const rateStr = res.percentage.replace('%', '');
          this.setChart(parseFloat(rateStr));
        },
        error: (err) => console.error('Error loading home attendee rate', err)
      });
    } else if (this.eventId) {
      this.attendeesService.getAttendeeRate(this.eventId).subscribe({
        next: (res: { attendeeRate: { attendanceRate: string } }) => {
          const rateStr = res.attendeeRate.attendanceRate.replace('%', '');
          this.setChart(parseFloat(rateStr));
        },
        error: (err) => console.error('Error loading attendee rate', err)
      });
    }
  }

  private setChart(rate: number) {
    this.attendeeRate = rate;
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        {
          data: [this.attendeeRate, 100 - this.attendeeRate],
          backgroundColor: ['#006D77', '#E0E0E0'],
          hoverBackgroundColor: ['#005962', '#cccccc'],
          borderWidth: 0,
          cutout: '70%'
        }
      ]
    };
  }
}
