import { Component, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { DataService } from './data.Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSidebarMinimized: boolean = false;
  showTopContainer: boolean = true;

  user:any ={};

  constructor(
    private router: Router,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private dataService: DataService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
    
        this.showTopContainer = true;

        this.cdr.detectChanges(); // Mark for changes
      }
    });
  }

  
  // This method will be called when the sidebar emits the toggle event
  onSidebarToggled(isCollapsed: boolean) {
    this.isSidebarMinimized = isCollapsed;
    // Mark for change detection
    this.cdr.detectChanges();
  }

  isCurrentPage(path: string): boolean {
    const currentUrl = this.router.url.split('?')[0]; // Strip query parameters from current URL
    const targetUrl = path.split('?')[0]; // Strip query parameters from target path

    return currentUrl === targetUrl;
  }
}
