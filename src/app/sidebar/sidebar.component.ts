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
  
  UserType= UserType; 

  user: any;
  userAccessLevel: any;

  allMenuItems = [ ];

  constructor(private dataService: DataService,
    private router: Router
  ) {
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);
      this.menuItems = this.getMenuItemsBasedOnUserType(this.userAccessLevel);
    });

     // Automatically collapse on mobile view
     if (window.innerWidth <= 768) {
      this.isCollapsed = true;
    }
  }
  

  ngOnInit(): void {
    
  }

  getMenuItemsBasedOnUserType(userAccessLevel: any): any[] {
    // Filter the menu items based on the userType
    const allMenuItems = [
      { 
        label: 'Dashboard', 
        icon: 'fa-tachometer', 
        route: '/dashboard', 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Employee List', 
        icon: 'fa-folder', 
        route: `/employee`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
      },
      { 
        label: 'Pay Generated', 
        icon: 'fa-folder', 
        route: `/payslip-records`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
      },
      { 
        label: 'Pay Not Generated', 
        icon: 'fa-folder', 
        route: `/payslip-records-waiting`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER]  
      },
      { 
        label: 'State List', 
        icon: 'fa-folder', 
        route: `/state`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      { 
        label: 'city List', 
        icon: 'fa-folder', 
        route: `/city`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      { 
        label: 'Category List', 
        icon: 'fa-folder', 
        route: `/category`, 
        allowedUserTypes:[ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      { 
        label: 'Department', 
        icon: 'fa-folder', 
        route: `/department`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR,] 
      },
      { 
        label: 'Company List', 
        icon: 'fa-folder', 
        route: `/company`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, ]  
      },
      { 
        label: 'Designation List', 
        icon: 'fa-folder', 
        route: `/designation`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, ] 
      },
      { 
        label: 'Degree List', 
        icon: 'fa-folder', 
        route: `/degree`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR,]  
      },
      { 
        label: 'Designation Qualification', 
        icon: 'fa-folder', 
        route: `/DesignationQualification`, 
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, ] 
      },
      {
        label: 'Shift Management',
        icon: 'fa-folder',
        route: '/shift-management',
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER]  
      },
      {
        label: 'Employee Report',
        icon: 'fa-folder',
        route: '/employee-report',
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER]  
      },
      {
        label: 'Vendor Payment Details',
        icon: 'fa-folder',
        route: '/vendor-payment-details',
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
      },
    
      {
        label: 'OD Slip',
        icon: 'fa-folder',
        route: '/odslipcompanylist',
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.EMPLOYEE] 
      },
      {
        label: 'OD Slip Approval',
        icon: 'fa-folder',
        route: '/odslipapproval',
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
      },
      {
        label: 'Leave Request',
        icon: 'fa-folder',
        route: '/empleaverequest',
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.EMPLOYEE] 
      },
      {
        label: 'Leave Approval',
        icon: 'fa-folder',
        route: '/Leaveapproval',
        allowedUserTypes: [ UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
      }
    
    ];

    return allMenuItems.filter(item => item.allowedUserTypes.includes(userAccessLevel)  || item.allowedUserTypes.includes('ALL' as UserType));
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
