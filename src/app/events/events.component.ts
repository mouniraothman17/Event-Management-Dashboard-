import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { ApiService, EventModel } from '../core/services/api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  events: EventModel[] = [];
  filteredEvents: EventModel[] = [];
  loading = true;
  pagination: any;
  currentPage = 1;

  searchQuery: string = '';
  showPagination = true;

  filters = {
    interest: '',
    province: '',
    priceMax: '',
    date: ''
  };

  loadFilter: boolean = false;

  // جميع المحافظات السورية مع الإحداثيات
  private provinceMap: { [key: string]: { lat: number, lng: number } } = {
    damascus: { lat: 33.5138, lng: 36.2765 },
    rif_dimashq: { lat: 33.5155, lng: 36.2950 },
    aleppo: { lat: 36.2021, lng: 37.1343 },
    homs: { lat: 34.7308, lng: 36.7090 },
    hama: { lat: 35.1318, lng: 36.7578 },
    latakia: { lat: 35.5319, lng: 35.7918 },
    tartus: { lat: 34.8873, lng: 35.8862 },
    deir_ez_zor: { lat: 35.3333, lng: 40.1333 },
    al_hasakah: { lat: 36.5000, lng: 40.7333 },
    raqqa: { lat: 35.9500, lng: 39.0167 },
    daraa: { lat: 32.6189, lng: 36.1030 },
    quneitra: { lat: 33.1333, lng: 35.8333 },
    idlib: { lat: 35.9306, lng: 36.6319 },
    sweida: { lat: 32.7167, lng: 36.5667 }
  };

  constructor(
    private eventsService: ApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private searchService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadEvents(this.currentPage);

    this.searchService.search$.subscribe(value => {
      this.searchQuery = value;
      if (value && value.trim() !== '') {
        this.showPagination = false;
        this.loadAllEvents();
      } else {
        this.showPagination = true;
        this.loadEvents(this.currentPage);
      }
    });

    this.route.queryParams.subscribe(params => {
      const value = params['search'];
      if (value) {
        this.searchQuery = value;
        this.searchService.setSearch(value);
      }
    });
  }

  loadEvents(page: number) {
    this.loading = true;
    this.eventsService.getAllEvents(page).subscribe({
      next: (response) => {
        this.events = response.result || [];
        this.filteredEvents = [...this.events];
        this.pagination = response.pagination;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events', err);
        this.loading = false;
      }
    });
  }

  loadAllEvents() {
  this.loading = true;
  this.events = [];
  this.filteredEvents = [];
  let page = 1;

  const fetchPage = () => {
    this.eventsService.getAllEvents(page).subscribe({
      next: (response) => {
        const eventsPage = response.result || [];
        eventsPage.forEach((ev :any) => {
          if (!this.events.find(e => e.id === ev.id)) {
            this.events.push(ev);
          }
        });

        if (page < response.pagination.totalPages) {
          page++;
          fetchPage();
        } else {
          this.applySearchAndFilters(true);
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching events', err);
        this.loading = false;
      }
    });
  };

  fetchPage();
}

  applySearchAndFilters(skipFilters: boolean = false) {
    let result = [...this.events];

    if (this.searchQuery && this.searchQuery.trim()) {
      result = result.filter(ev =>
        ev.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (!skipFilters) {
      if (this.filters.interest) {
        result = result.filter(ev =>
          ev.interest?.toLowerCase() === this.filters.interest.toLowerCase()
        );
      }

    // ضمن applySearchAndFilters
if (this.filters.province) {
  const selectedProvince = this.filters.province.toLowerCase();
  result = result.filter(ev => {
    const coords: any = ev.location?.coordinates; // تحديد النوع any لتجنب أخطاء TS
    if (!coords) return false;

    let lat: number | null = null;
    let lng: number | null = null;

    if (Array.isArray(coords)) {
      [lng, lat] = coords;
    } else if (typeof coords === 'object' && 'lat' in coords && 'lng' in coords) {
      lat = coords.lat;
      lng = coords.lng;
    }

    if (lat !== null && lng !== null) {
      const nearest = this.getNearestProvince(lat, lng);
      return nearest.toLowerCase() === selectedProvince;
    }

    return false;
  });
}

      if (this.filters.priceMax) {
        result = result.filter(ev => ev['price'] <= +this.filters.priceMax);
      }

      if (this.filters.date) {
        result = result.filter(ev => ev.date && ev.date.startsWith(this.filters.date));
      }
    }

    this.filteredEvents = result;
  }

  private getNearestProvince(lat: number, lng: number): string {
    let nearestProvince: string = '';
    let minDist = Infinity;

    for (const [province, coords] of Object.entries(this.provinceMap)) {
      const distance = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2));
      if (distance < minDist) {
        minDist = distance;
        nearestProvince = province;
      }
    }

    return nearestProvince.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }

  applyFilters() {
    this.loadFilter = true;
    this.showPagination = false;
    const token = localStorage.getItem('token') ?? '';

    this.eventsService.filterEvents(this.filters, token).subscribe({
      next: (data) => {
        this.events = data.data || [];
        this.applySearchAndFilters(true);
        this.loadFilter = false;

        if (!this.filters.interest && !this.filters.province && !this.filters.priceMax && !this.filters.date && !this.searchQuery) {
          this.showPagination = true;
        }
      },
      error: (err) => {
        console.error('Error fetching filtered events', err);
        this.loadFilter = false;
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.pagination.totalPages) {
      this.currentPage++;
      this.loadEvents(this.currentPage);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEvents(this.currentPage);
    }
  }

  openAddEventDialog() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '450px',
      height: '650px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleNewEvent(result);
      }
    });
  }

  handleNewEvent(event: any) {
    const token = localStorage.getItem("token") ?? "";

    this.eventsService.createEvent(event, token).subscribe({
      next: (res) => {
        console.log("✅ Event created:", res);
        this.events.unshift(res);
        this.applySearchAndFilters(true);
      },
      error: (err) => console.error("❌ Error creating event:", err)
    });
  }
}
