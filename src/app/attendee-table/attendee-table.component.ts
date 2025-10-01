import { Component, OnInit } from '@angular/core';
import { AttendeesService } from '../attendees.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-attendee-table',
  templateUrl: './attendee-table.component.html',
  styleUrls: ['./attendee-table.component.css']
})
export class AttendeeTableComponent implements OnInit {

  currentDate: Date = new Date();
  attendees: any[] = [];
  searchControl = new FormControl('');

  constructor(private attendeeService: AttendeesService) { }

  ngOnInit(): void {
    // تحميل جميع الحضور أولاً
    this.loadAttendees();

    // مراقبة تغييرات حقل البحث
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query) {
          // إذا الحقل فارغ، إعادة تحميل كل الحضور
          this.loadAttendees();
          return [];
        }
        return this.attendeeService.searchAttendees(query);
      })
    ).subscribe({
      next: (res: any) => {
        if (res && res.attendees) {
          this.attendees = res.attendees.map((a: any) => ({
            name: a.user?.name || '-',
            phone: a.user?.phoneNumber || '-',
            event: a.publicEvent?.name || '-',
            bookedDate: a.publicEvent?.date
              ? new Date(a.publicEvent.date).toLocaleDateString()
              : '-',
            seats: a.seats
          }));
        }
      },
      error: (err) => console.error('Error searching attendees:', err)
    });
  }

  loadAttendees(): void {
    this.attendeeService.getAttendees().subscribe({
      next: (res) => {
        this.attendees = res.attendeeList.map((a: any) => ({
          name: a.user?.name || '-',
          phone: a.user?.phoneNumber || '-',
          event: a.publicEvent?.name || '-',
          bookedDate: a.publicEvent?.date
            ? new Date(a.publicEvent.date).toLocaleDateString()
            : '-',
          seats: a.seats
        }));
      },
      error: (err) => console.error('Error fetching attendees:', err)
    });
  }
}
