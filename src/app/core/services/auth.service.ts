import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://graduate-kgh0.onrender.com/api/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    const body = {
      email,
      password,
      fcmToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUyM2VjZTRjLTI3OGItNDVmNC04OWU5LTk1ZTE2MzFjYWRhYiIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NTc4NTMzMTR9.zKtOBb7BQkRyvN78rPYgE-EeYMyz0E-bDibEdN7H0KU'
    };

    return this.http.post<{ token: string }>(this.apiUrl, body);
  }

  private calenderUrl = 'https://graduate-kgh0.onrender.com/api/admin/calendar';

  getEvents(): Observable<any> {
    return this.http.get<any>(this.calenderUrl);
  }
}
