import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { EventsService } from 'src/app/event.service';

@Component({
  selector: 'app-events-section',
  templateUrl: './events-section.component.html',
  styleUrls: ['./events-section.component.css']
})
export class EventsSectionComponent implements OnInit{
events: any[] = [];
  totalAttendees = 0;
  eventsPre: any[] = [];
  attendeesCount: number = 5;

  constructor(private eventService: ApiService) {}

  ngOnInit(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: res => {
        this.events = res.events;
        this.totalAttendees = res.attende;
        console.log(res);

      },
      error: err => {
        console.error('Error fetching events:', err);
      }
    });
    this.eventService.getPastEvents().subscribe({
      next: (response) => {
        console.log(response);

        this.eventsPre = response.events;
        console.log(this.eventsPre);

        this.attendeesCount = response.attendees ;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      }
    });
  }



}
