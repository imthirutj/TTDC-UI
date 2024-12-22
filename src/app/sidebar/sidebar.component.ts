import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { DataService } from '../data.Service';
import { Router } from '@angular/router';
import { UserType } from '../common/user-type.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;
  
  @Output() sidebarToggled: EventEmitter<boolean> = new EventEmitter<boolean>();

  menuItems: any[] = [];
  
  userType: UserType | null = null; 


  allMenuItems = [
  ];

  constructor(private dataService: DataService,
    private router: Router
  ) {
     // Automatically collapse on mobile view
     if (window.innerWidth <= 768) {
      this.isCollapsed = true;
    }
  }

  ngOnInit(): void {
    // this.dataService.getUserAccessLevel().then((ut) => {
    //   this.userType = ut; // Default to STATE_ADMIN if userType is empty

    //   // Check if userType is still empty after assignment, and redirect to login if true
    //   if (!this.userType) {
    //     console.log('Redirect to Login Page ')
    //     this.router.navigate(['/login']);
    //   } else {
    //     // Filter the menu items based on the userType
    //     this.menuItems = this.getMenuItemsBasedOnUserType(this.userType);
    //   }
    // }).catch((error) => {
    //   // Handle error if needed, for example logging
    //   console.error('Error while fetching user access level:', error);
    //   this.router.navigate(['/login']);
    // });
    // this.sidebarToggled.emit(this.isCollapsed);
  }

  getMenuItemsBasedOnUserType(userType: any): any[] {
    // Filter the menu items based on the userType
    const allMenuItems = [
      { 
        label: 'Dashboard', 
        icon: 'fa-tachometer', 
        route: '/dashboard', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.DMER_ADMIN, UserType.IFPU, UserType.FSU, UserType.SFU] 
      },
      { 
        label: 'Institutional Profile', 
        icon: 'fa-folder', 
        route: `/inst_profile/${this.dataService.getInstitutionId()}`, 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.INSTITUTION_ADMIN] 
      },
      { 
        label: 'Institutional Field Practice Units', 
        icon: 'fa-folder', 
        route: `/units`, 
        allowedUserTypes: [ 'ALL'] 
      },
    
    ];

    return allMenuItems.filter(item => item.allowedUserTypes.includes(userType)  || item.allowedUserTypes.includes('ALL' as UserType));
  }


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth <= 768) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
    this.sidebarToggled.emit(this.isCollapsed);
  }
}
