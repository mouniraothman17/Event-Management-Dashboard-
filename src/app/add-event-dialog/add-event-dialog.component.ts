import { Component, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.css']
})
export class AddEventDialogComponent implements AfterViewInit {

  event: any = {
    name: '',
    description: '',
    date: '',
    location: null,
    price: 100,
    tickets: 100,
    image: null,
    interest: '',
    time:''
  };

  private map: any;
  private marker: any;

  constructor(public dialogRef: MatDialogRef<AddEventDialogComponent>) {}

  ngAfterViewInit(): void {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });

    this.map = L.map('map', {
      center: [34.8021, 38.9968],
      zoom: 6,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const coords = e.latlng;
      this.event.location = { lat: parseFloat(coords.lat.toFixed(6)), lng: parseFloat(coords.lng.toFixed(6)) };

      if (this.marker) this.map.removeLayer(this.marker);
      this.marker = L.marker([coords.lat, coords.lng])
        .addTo(this.map)
        .bindTooltip(`📍 ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`, { permanent: true, direction: 'top' });
    });

    setTimeout(() => this.map.invalidateSize(), 300);
  }

  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.event.image = event.target.files[0];
    }
  }

  increasePrice() { this.event.price += 10; }
  decreasePrice() { if (this.event.price > 0) this.event.price -= 10; }

  onCancel(): void {
    this.dialogRef.close();
  }
onCreate(form: any) {
  if (form.invalid) {
    Object.values(form.controls).forEach((control: any) => {
      control.markAsTouched();
    });
    return;
  }

  const payload = {
    name: this.event.name,
    description: this.event.description,
    price: this.event.price,
    tickets: this.event.tickets,
    date: this.event.date,
    time: this.event.time,
    interest: this.event.interest,
    location: {
      type: "Point",
      coordinates: [this.event.location.lng, this.event.location.lat]
    },
    image: this.event.image
  };

  this.dialogRef.close(payload);
}

}
