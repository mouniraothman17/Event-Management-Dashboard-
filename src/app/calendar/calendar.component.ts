import { Component, OnInit } from '@angular/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

 calendarOptions: any = {
  initialView: 'timeGridWeek',
  plugins: [timeGridPlugin, interactionPlugin],
  slotMinTime: '08:00:00',
  slotMaxTime: '24:00:00',
  allDaySlot: false,
  nowIndicator: true,
 timeZone: 'UTC',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek,timeGridDay'
  },
  events: []
};

  constructor(private calendarService: AuthService) {}

  ngOnInit(): void {
    this.calendarService.getEvents().subscribe({
      next: (res) => {
        this.calendarOptions.events = res.events.map((e: any) => ({
          title: e.title,
          start: e.start,
          end: e.end,
          backgroundColor: e.backgroundColor,
          textColor: e.textColor,
          borderColor: e.backgroundColor
        }));
      },
      error: (err) => {
        console.error('Error fetching events', err);
      }
    });
  }
}
