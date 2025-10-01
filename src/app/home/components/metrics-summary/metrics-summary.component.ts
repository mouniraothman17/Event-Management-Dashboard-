import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialogComponent } from 'src/app/add-event-dialog/add-event-dialog.component';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-metrics-summary',
  templateUrl: './metrics-summary.component.html',
  styleUrls: ['./metrics-summary.component.css']
})
export class MetricsSummaryComponent implements OnInit {
  
  totalEarnings: number | null = null;
  totalUsers: number | null = null;
  totalEvents: number | null = null;

  constructor(private eventsService: ApiService, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.eventsService.getTotalEarning().subscribe({
      next: (res) => {
        this.totalEarnings =res.earnings
          console.log('API Response:', res)

      },
      error: (err) => console.error('Error loading earning count', err)

    });

    this.eventsService.getTotalUsers().subscribe({
      next: (res) => this.totalUsers = res.usersCount,
      error: (err) => console.error('Error loading users count', err)
    });

    this.eventsService.getTotalEvents().subscribe({
      next: (res) => this.totalEvents = res.eventsCount,
      error: (err) => console.error('Error loading events count', err)
    });
  }


  @Output() eventCreated = new EventEmitter<any>();


  openAddEventDialog() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '450px',
      height: '650px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventCreated.emit(result);
      }
    });
  }
}
