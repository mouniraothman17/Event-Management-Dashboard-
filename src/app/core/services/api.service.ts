
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';


interface EventResponse {
  message: string;
  events: {
    id: number;
    name: string;
    image: string;
    user: {
      id: string;
      name: string;
    };
  }[];
  attende: number;
}

interface UsersResponse {
  usersCount: number;
}

interface Earnings {
  message: string,
  earnings: number

}

interface EventsResponse {
  eventsCount: number;
}

interface EventByMonth {
  month: string;
  event_count: string;
}

interface ApiResponse {
  results: EventByMonth[];
}

interface RevenueResponse {
  results: {
    month: string;
    event_count: string;
  }[];
}

export interface EventModel {
  id: number;
  name: string;
  image: string;
  user?: any;

  location?: {
    type: string;
    coordinates: [number, number];
  };
  interest: string;
  date?: string;
  attendeesRate?: number;
  likes?: number;
  status?: string;
  time?: string;

  [key: string]: any;
}

export interface detailsModel {
   id: number;
  name: string;
  description: string;
  image: string;
  date: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  interest: string;

  likes?: number;
  tickets?: number;
  price?: number;
  user?: any;
  time?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://graduate-kgh0.onrender.com/api/admin/home/upcomingEvent';

  constructor(private http: HttpClient) { }

  getUpcomingEvents(): Observable<EventResponse> {
    return this.http.get<EventResponse>(this.apiUrl);
  }
  private previousApi = 'https://graduate-kgh0.onrender.com/api/admin/home/pastEvent';


  getPastEvents(): Observable<any> {
    return this.http.get<any>(this.previousApi);
  }
  private cityApi = 'https://graduate-kgh0.onrender.com/api/admin/home/eventByLocation';


  getEventByLocation(): Observable<any> {
    return this.http.get<any>(this.cityApi);
  }



  private earningUrl = 'https://graduate-kgh0.onrender.com/api/admin/home/totalEarnings';
  getTotalEarning(): Observable<Earnings> {
    return this.http.get<Earnings>(this.earningUrl);
  }

  private usersUrl = 'https://graduate-kgh0.onrender.com/api/admin/home/totalUsers';
  getTotalUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.usersUrl);
  }

  private eventsUrl = 'https://graduate-kgh0.onrender.com/api/admin/home/totalEvents';
  getTotalEvents(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.eventsUrl);
  }

  private chartMonthApi = 'https://graduate-kgh0.onrender.com/api/admin/home/eventByMonth';

  getRevenueData(): Observable<RevenueResponse> {
    return this.http.get<RevenueResponse>(this.chartMonthApi);
  }
  private apiAllEvent = 'https://graduate-kgh0.onrender.com/api/event';

  getAllEvents(page: number = 1, pageSize: number = 6) {
    return this.http.get<any>(`https://graduate-kgh0.onrender.com/api/event?page=${page}&pageSize=${pageSize}`);
  }



  private apiSearch = 'https://graduate-kgh0.onrender.com/api/search/name';

  getEventById(id: number): Observable<{ event: detailsModel }> {
    return this.http.get<{ event: detailsModel }>(`${this.apiAllEvent}/oneEvent/${id}`);
  }
  searchEvents(name: string): Observable<any> {
    return this.http.get<any>(`${this.apiSearch}?name=${name}`);
  }

  private apiCreateEvent = 'https://graduate-kgh0.onrender.com/api/event';
  private eventsSubject = new BehaviorSubject<EventModel[]>([]);
  events$ = this.eventsSubject.asObservable();

  loadEvents() {
    this.http.get<EventModel[]>('/api/events').subscribe(events => {
      this.eventsSubject.next(events);
    });
  }

  addEvent(event: EventModel) {
    return this.http.post<EventModel>('/api/events', event).pipe(
      tap(newEvent => {
        const current = this.eventsSubject.value;
        this.eventsSubject.next([...current, newEvent]);
      })
    );
  }
  createEvent(eventData: any, token: string) {
    const formData = new FormData();

    if (eventData.image instanceof File) {
      formData.append("image", eventData.image, eventData.image.name);
    }

    formData.append("name", eventData.name);
    formData.append("description", eventData.description);
    formData.append("price", eventData.price.toString());
    formData.append("tickets", eventData.tickets.toString());
    formData.append("interest", eventData.interest);
    formData.append("date", eventData.date);
    formData.append("time", eventData.time);
    formData.append("location", JSON.stringify(eventData.location));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(`${this.apiCreateEvent}`, formData, { headers });
  }


  getEvents(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(this.apiCreateEvent, { headers });
  }

  async getLocationName(lat: number, lon: number): Promise<string> {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`);
      const data = await res.json();
      const a = data?.address;

      if (!a) return 'Unknown location';

      return a.city || a.town || a.village || a.subdistrict || a.district || a.county || a.state || a.country || 'Unknown';
    } catch (err) {
      console.error('Error fetching location name:', err);
      return 'Unknown location';
    }
  }


  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  setSearch(value: string) {
    this.searchSubject.next(value);
  }


  filterEvents(filters: any, token: string) {
    let url = 'https://graduate-kgh0.onrender.com/api/search/filter?';
    if (filters.interest) url += `interest=${filters.interest}&`;
    if (filters.province) url += `province=${filters.province}&`;
    if (filters.priceMax) url += `priceMax=${filters.priceMax}&`;
    if (filters.date) url += `date=${filters.date}&`;
    url = url.slice(0, -1);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers });
  }
}
