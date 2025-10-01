import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AttendeesService {

  private homeAttendeesUrl = 'https://graduate-kgh0.onrender.com/api/admin/attendee';

  constructor(private http: HttpClient) {}

  getAttendees(): Observable<any> {
    return this.http.get<any>(this.homeAttendeesUrl);
  }

  private usersUrl = 'https://graduate-kgh0.onrender.com/api/admin/users';

   getUsers(): Observable<any> {
    return this.http.get<any>(this.usersUrl);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.usersUrl}/${userId}`);
  }


   private userSearchUrl = 'https://graduate-kgh0.onrender.com/api';



  searchUsers(name: string): Observable<any> {
    return this.http.get<any>(`${this.userSearchUrl}/search/users?name=${name}`);
  }

   private attendeesSearchUrl = 'https://graduate-kgh0.onrender.com/api';

  searchAttendees(name: string): Observable<any> {
    return this.http.get<any>(`${this.attendeesSearchUrl}/search/attendee?name=${name}`);
  }

  private rateUrl = 'https://graduate-kgh0.onrender.com/api';
  getAttendeeRate(eventId: number) {
  return this.http.get<{ attendeeRate: { attendanceRate: string } }>(
    `${this.rateUrl}/admin/attendee/attendee-Rate/${eventId}`
  );
}

  getHomeAttendeeRate(): Observable<{ percentage: string }> {
    return this.http.get<{ percentage: string }>(`${this.rateUrl}/admin/home/usersWithEvents`);
  }

}
