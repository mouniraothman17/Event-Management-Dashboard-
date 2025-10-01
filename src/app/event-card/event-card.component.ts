import { Component, Input, OnInit } from '@angular/core';
import { EventModel } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { getDistance } from 'geolib';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {

  @Input() event!: EventModel;
  @Input() filterProvince: string = '';
  eventLocationName: string = 'Loading...';

  constructor(private http: HttpClient) { }

  private cities = [
    { name: 'Damascus, Syria', lat: 33.5138, lon: 36.2765 },
    { name: 'Rif Dimashq, Syria', lat: 33.5155, lon: 36.2950 },
    { name: 'Aleppo, Syria', lat: 36.2021, lon: 37.1343 },
    { name: 'Homs, Syria', lat: 34.7308, lon: 36.7090 },
    { name: 'Hama, Syria', lat: 35.1318, lon: 36.7578 },
    { name: 'Latakia, Syria', lat: 35.5319, lon: 35.7918 },
    { name: 'Tartus, Syria', lat: 34.8873, lon: 35.8862 },
    { name: 'Deir ez-Zor, Syria', lat: 35.3333, lon: 40.1333 },
    { name: 'Al-Hasakah, Syria', lat: 36.5000, lon: 40.7333 },
    { name: 'Raqqa, Syria', lat: 35.9500, lon: 39.0167 },
    { name: 'Daraa, Syria', lat: 32.6189, lon: 36.1030 },
    { name: 'Quneitra, Syria', lat: 33.1333, lon: 35.8333 },
    { name: 'Idlib, Syria', lat: 35.9306, lon: 36.6319 },
    { name: 'Sweida, Syria', lat: 32.7167, lon: 36.5667 }
  ];

  ngOnInit(): void {
    console.log("Event Object:", this.event);

    if (this.filterProvince) {
      this.eventLocationName = this.capitalizeProvince(this.filterProvince);
    }
    else if (this.event['province']) {
      this.eventLocationName = `${this.event['province']}, Syria`;
    }
    else if (Array.isArray(this.event?.location)) {
      const [lng, lat] = this.event.location;
      this.getLocationName(lat, lng);
    }
    else {
      this.eventLocationName = 'Unknown location';
    }
  }

  private getLocationName(lat: number, lon: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        const a = data?.address || {};
        const nameFromApi = [a.state, a.country].filter(Boolean).join(', ');
        if (nameFromApi) {
          this.eventLocationName = nameFromApi;
        } else {
          this.eventLocationName = this.getNearestCity(lat, lon);
        }
        console.log("📍 Address object from API:", a);
      },
      error: (err) => {
        console.error('Reverse geocoding error:', err);
        this.eventLocationName = this.getNearestCity(lat, lon);
      }
    });
  }

  private getNearestCity(lat: number, lon: number): string {
    let nearestCity = this.cities[0];
    let minDistance = getDistance(
      { latitude: lat, longitude: lon },
      { latitude: nearestCity.lat, longitude: nearestCity.lon }
    );

    for (const city of this.cities) {
      const dist = getDistance(
        { latitude: lat, longitude: lon },
        { latitude: city.lat, longitude: city.lon }
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestCity = city;
      }
    }

    return nearestCity.name;
  }

  private capitalizeProvince(prov: string): string {
    return prov
      .split('_')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  }
}
