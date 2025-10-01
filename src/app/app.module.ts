import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './home/home.component';
import { MetricsSummaryComponent } from './home/components/metrics-summary/metrics-summary.component';
import { EventsSectionComponent } from './home/components/events-section/events-section.component';
import { AttendeesListComponent } from './home/components/attendees-list/attendees-list.component';
import { ChartsSectionComponent } from './home/components/charts-section/charts-section.component';
import { NgChartsModule } from 'ng2-charts';
import { AttendeeRateComponent } from './home/components/attendee-rate/attendee-rate.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsComponent } from './events/events.component';
import { EventCardComponent } from './event-card/event-card.component';
import { CommonModule } from '@angular/common';
import { EventDetailsComponent } from './event-details/event-details.component';
import { AttendeeTableComponent } from './attendee-table/attendee-table.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar/calendar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmLogoutDialogComponent } from './layout/confirm-logout-dialog/confirm-logout-dialog.component';
import { UsersComponent } from './users/users.component';
import { DeleteDialogComponent } from './users/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    MetricsSummaryComponent,
    EventsSectionComponent,
    AttendeesListComponent,
    ChartsSectionComponent,
    AttendeeRateComponent,
    LoginComponent,
    EventsComponent,
    EventCardComponent,
    EventDetailsComponent,
    CalendarComponent,
    AddEventDialogComponent,
    ConfirmLogoutDialogComponent,
    AttendeeTableComponent,
    UsersComponent,
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgChartsModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
    BrowserAnimationsModule,
     MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
