import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  today = new Date().toDateString();
  searchQuery: string = '';
  searchResults: any[] = [];
  currentDate: Date = new Date();

  constructor(
    private searchService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000 * 60);

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchQuery = params['search'];
      }
    });
  }

  handleKey(event: KeyboardEvent) {
    const currentUrl = this.router.url;

    if (currentUrl.includes('/events')) {
      this.searchService.setSearch(this.searchQuery);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { search: this.searchQuery },
        queryParamsHandling: 'merge',
      });
    } else if (currentUrl.includes('/home')) {
      if (event.key === 'Enter') {
        this.router.navigate(['/events'], { queryParams: { search: this.searchQuery } });
      }
    }
  }
  
}
