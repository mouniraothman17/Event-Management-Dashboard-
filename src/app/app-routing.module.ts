import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { EventsComponent } from './events/events.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { AttendeeTableComponent } from './attendee-table/attendee-table.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent ,canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'events', component: EventsComponent },
  { path: 'attendees', component: AttendeeTableComponent },
  { path: 'user', component: UsersComponent },
  { path: 'events/:id', component: EventDetailsComponent },
  { path: 'calender', component: CalendarComponent },
  { path: 'dialog', component: AddEventDialogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
