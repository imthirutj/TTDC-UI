import { Component, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSidebarMinimized: boolean = false;

  constructor(
    private router: Router,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
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
    return this.router.url === path;
  }
}
