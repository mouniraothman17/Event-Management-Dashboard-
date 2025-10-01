import { Component } from '@angular/core';
import { AttendeesService } from 'src/app/attendees.service';

@Component({
  selector: 'app-attendees-list',
  templateUrl: './attendees-list.component.html',
  styleUrls: ['./attendees-list.component.css']
})
export class AttendeesListComponent {
  attendees: any[] = [];

  constructor(private attendeeService: AttendeesService) {}

  ngOnInit(): void {
    this.attendeeService.getAttendees().subscribe({
      next: (res) => {
        this.attendees = res.attendeeList
          .map((a: any) => ({
            name: a.user?.name || '-',
            phone: a.user?.phoneNumber || '-',
            event: a.publicEvent?.name || '-',
            bookedDate: a.publicEvent?.date
              ? new Date(a.publicEvent.date).toLocaleDateString()
              : '-',
            seats: a.seats
          }))
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Error fetching attendees:', err);
      }
    });
  }
  
}

