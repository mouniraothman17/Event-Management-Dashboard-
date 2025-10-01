import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-charts-section',
  templateUrl: './charts-section.component.html',
  styleUrls: ['./charts-section.component.css']
})
export class ChartsSectionComponent implements OnInit, AfterViewInit {

  bookingLabels: string[] = [];
  bookingData: { data: number[], label: string, backgroundColor: string }[] = [];

  bookingOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          autoSkip: false
        }
      },
      y: { display: true, beginAtZero: true }
    },
    plugins: {
      legend: { display: false }
    }
  };

  constructor(private bookingService: ApiService) {}

  ngOnInit(): void {
    this.bookingService.getEventByLocation().subscribe({
      next: (response: any) => {
        if (response && response.results) {
          this.bookingLabels = response.results.map((item: any) => item.province_name);

          this.bookingData = [
            {
              data: response.results.map((item: any) => Number(item.event_count) || 0),
              label: 'Events',
              backgroundColor: '#0f3c56'
            }
          ];

          console.log('Booking Labels:', this.bookingLabels);
          console.log('Booking Data:', this.bookingData[0].data);
        }
      },
      error: (err) => {
        console.error('Error fetching data', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.bookingService.getRevenueData().subscribe({
      next: (response: any) => {
        if (response && response.results) {
          const labels = response.results.map((item: any) => {
            const date = new Date(item.month + '-01');
            return date.toLocaleString('en-US', { month: 'short' });
          });
          const dataPoints = response.results.map((item: any) => Number(item.event_count) || 0);

          const canvas = document.getElementById('Revenue') as HTMLCanvasElement;
          if (canvas) {
            new Chart(canvas, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Event',
                  data: dataPoints,
                  borderColor: '#207387',
                  borderWidth: 2,
                  tension: 0.4,
                  fill: false
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: {
                    ticks: { font: { size: 10 } }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { font: { size: 10 } }
                  }
                }
              }
            });
          }
        }
      },
      error: (err) => {
        console.error('Error fetching revenue data', err);
      }
    });
  }
}
