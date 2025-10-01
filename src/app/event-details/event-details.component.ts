import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomEvent } from '../models/event.model';
import { EventsService } from '../event.service';
import * as L from 'leaflet';
import { ApiService, detailsModel } from '../core/services/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})

export class EventDetailsComponent implements OnInit {

  event?: detailsModel;
  map!: L.Map;
  today = new Date().toDateString();
  currentDate: Date = new Date();

  eventLocationName: string = 'Loading...';
  fullLocationName: string = '';

  constructor(
    private eventDetailsService: ApiService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    const iconDefault = L.Icon.Default.prototype as any;
    iconDefault.options.iconRetinaUrl = '../../assets/leaflet/marker-icon-2x.png';
    iconDefault.options.iconUrl = '../../assets/leaflet/marker-icon.png';
    iconDefault.options.shadowUrl = '../../assets/leaflet/marker-shadow.png';
  }

  private getLocationName(lat: number, lon: number): void {
    const url = `/nominatim/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en`;
    this.http.get<any>(url)
      .subscribe({
        next: (data) => {
          const a = data?.address || {};
          this.eventLocationName =
            a.city || a.town || a.village || a.hamlet || a.suburb || a.state || a.county || a.country || 'Unknown';
          console.log("📍 Address object:", a);

          this.fullLocationName = [
            a.road,
            a.neighbourhood,
            a.city, a.town, a.village,
            a.state,
            a.country
          ].filter(Boolean).join(', ');

          if (this.map) {
            L.marker([lat, lon])
              .addTo(this.map)
              .bindPopup(
                `<strong>${this.eventLocationName}</strong><br>${this.fullLocationName || ''}`
              );
          }
        },
        error: (err) => {
          console.error('Reverse geocoding error:', err);
          this.eventLocationName = 'Unknown';
          this.fullLocationName = '';
        }
      });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventDetailsService.getEventById(id).subscribe({
      next: (res) => {
        this.event = res.event;

        if (!this.event.image || this.event.image === 'ssssss') {
          this.event.image = 'assets/default-event.png';
        }

        setTimeout(() => this.initMap());
      },
      error: (err) => console.error(err)
    });
  }

  ngAfterViewInit(): void {
    if (this.event) this.initMap();
  }

  private initMap(): void {
    if (!this.event || !this.event.location) return;

    let lon: number | undefined;
    let lat: number | undefined;

    const loc: any = this.event.location;
    if (Array.isArray(loc)) {
      [lon, lat] = loc;
    } else if (loc?.coordinates) {
      [lon, lat] = loc.coordinates;
    }

    if (lat == null || lon == null) return;

    this.map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const marker = L.marker([lat, lon]).addTo(this.map);

    marker.bindPopup(" Your current location").openPopup();

    this.getLocationName(lat, lon);
  }
}
