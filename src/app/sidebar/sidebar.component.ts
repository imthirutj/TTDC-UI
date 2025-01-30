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
        icon: 'fa-solid fa-tachometer-alt', 
        route: '/dashboard', 
         allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER, UserType.EMPLOYEE] 
      },
      { 
        label: 'Employee List', 
        icon: 'fa-solid fa-users', 
        route: '/employee', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
      },
      { 
        label: 'Pay Generated', 
        icon: 'fa-solid fa-file-invoice-dollar', 
        route: '/payslip-records', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.MANAGER, UserType.VENDOR] 
      },
      { 
        label: 'Pay Not Generated', 
        icon: 'fa-solid fa-file-excel', 
        route: '/payslip-records-waiting', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.MANAGER, UserType.VENDOR]  
      },
      { 
        label: 'State List', 
        icon: 'fa-solid fa-map-marked-alt', 
        route: '/state', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      { 
        label: 'City List', 
        icon: 'fa-solid fa-city', 
        route: '/city', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      { 
        label: 'Category List', 
        icon: 'fa-solid fa-th-list', 
        route: '/category', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      {
        label: 'Vendor Management',
        icon: 'fa-solid fa-store',
        route: '/vendor-management',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      { 
        label: 'Department', 
        icon: 'fa-solid fa-sitemap', 
        route: '/department', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      { 
        label: 'Company List', 
        icon: 'fa-solid fa-building', 
        route: '/company', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR]  
      },
      { 
        label: 'Designation List', 
        icon: 'fa-solid fa-id-badge', 
        route: '/designation', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      { 
        label: 'Degree List', 
        icon: 'fa-solid fa-graduation-cap', 
        route: '/degree', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR]  
      },
      { 
        label: 'Designation Qualification', 
        icon: 'fa-solid fa-tasks', 
        route: '/DesignationQualification', 
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      {
        label: 'Shift Management',
        icon: 'fa-solid fa-clock',
        route: '/shift-management',
        allowedUserTypes: [ UserType.MANAGER]  
      },
      // {
      //   label: 'Employee Report',
      //   icon: 'fa-solid fa-chart-line',
      //   route: '/employee-report',
      //   allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER]  
      // },
      {
        label: 'Employee Work Report',
        icon: 'fa-solid fa-chart-line',
        route: '/employee-work-report',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER]  
      },
      {
        label: 'Vendor Payment Details',
        icon: 'fa-solid fa-receipt',
        route: '/vendor-payment-details',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      {
        label: 'Vendor To Employee Payment',
        icon: 'fa-solid fa-receipt',
        route: '/vendor-employee-payment-details',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      },
      {
        label: 'OD Slip',
        icon: 'fa-solid fa-file-alt',
        route: '/odslipcompanylist',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.EMPLOYEE] 
      },
      {
        label: 'OD Slip Approval',
        icon: 'fa-solid fa-check-circle',
        route: '/odslipapproval',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
      },
      {
        label: 'Leave Request',
        icon: 'fa-solid fa-envelope-open-text',
        route: '/empleaverequest',
        allowedUserTypes: [UserType.EMPLOYEE] 
      },
      {
        label: 'Leave Approval',
        icon: 'fa-solid fa-thumbs-up',
        route: '/Leaveapproval',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
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
