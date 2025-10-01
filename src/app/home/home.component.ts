import { Component, OnInit } from '@angular/core';
import { ApiService, EventModel } from '../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  events: EventModel[] = [];
  filteredEvents: EventModel[] = [];
  loading = true;

  constructor(private eventsService: ApiService , private router: Router) {}

  ngOnInit() {
    this.fetchEvents();
  }

  fetchEvents() {
    const token = localStorage.getItem("token") ?? "";
    this.eventsService.getEvents(token).subscribe({
      next: (res) => {
        this.events = res;
        this.filteredEvents = res;
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ Error fetching events:", err);
        this.loading = false;
      }
    });
  }

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/events'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/events']);
    }
  }

  handleNewEvent(event: any) {
    const token = localStorage.getItem("token") ?? "";

    this.eventsService.createEvent(event, token).subscribe({
      next: (res) => {
        console.log("✅ Event created:", res);
        const newEvent = res;
        this.events.push(newEvent);
      },
      error: (err) => {
        console.error("❌ Error creating event:", err);
      }
    });
  }
}
