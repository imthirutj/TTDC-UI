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

  UserType = UserType;

  user: any;
  userAccessLevel: any;

  allMenuItems = [];

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
    this.firstTimeScreen();
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
        label: 'Employee Report Dashboard',
        icon: 'fa-solid fa-tachometer-alt',
        route: '/dashboard-employee-report',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER, UserType.EMPLOYEE]
      },
      {
        label: 'Logged In & Not Logged In',
        icon: 'fa-solid fa-user-check', // Represents login/logout status
        route: '/loggedin-notloggedin-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      {
        label: 'Leave Report',
        icon: 'fa-solid fa-calendar-minus', // Represents leave or absence
        route: '/leave-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      {
        label: 'OD Report',
        icon: 'fa-solid fa-briefcase', // Represents official duty/work
        route: '/od-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      
      {
        label: 'Designation Wise Report',
        icon: 'fa-solid fa-user-tie', // Represents job roles or designations
        route: '/designation-wise-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      {
        label: 'Section Wise Report',
        icon: 'fa-solid fa-layer-group', // Represents different sections or groups
        route: '/section-wise-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      {
        label: 'Unit Wise Report',
        icon: 'fa-solid fa-building', // Represents organizational units
        route: '/unit-wise-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      {
        label: 'Vendor Wise Report',
        icon: 'fa-solid fa-truck', // Represents vendors or suppliers
        route: '/vendor-wise-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      {
        label: 'Region Wise Report',
        icon: 'fa-solid fa-map-marked-alt', // Represents geographic regions
        route: '/region-wise-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
      },
      {
        label: 'Employee Min Qualifications',
        icon: 'fa-solid fa-map-marked-alt', // Represents geographic regions
        route: '/emp-min-qual-report',
        allowedUserTypes: [UserType.STATE_ADMIN]
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
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.MANAGER, UserType.VENDOR, UserType.EMPLOYEE,]
      },
      {
        label: 'Pay Not Generated',
        icon: 'fa-solid fa-file-excel',
        route: '/payslip-records-waiting',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.COMPANY_ADMIN, UserType.MANAGER]
      },
      // { 
      //   label: 'State List', 
      //   icon: 'fa-solid fa-map-marked-alt', 
      //   route: '/state', 
      //   allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN] 
      // },
      {
        label: 'Region Master',
        icon: 'fa-solid fa-city',
        route: '/city',
        allowedUserTypes: [UserType.CITY_ADMIN, UserType.COMPANY_ADMIN]
      },
      {
        label: 'Holiday Master',
        icon: 'fa-solid fa-city',
        route: '/holiday-mgmt',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN]
      },

      // { 
      //   label: 'Category List', 
      //   icon: 'fa-solid fa-th-list', 
      //   route: '/category', 
      //   allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR] 
      // },
      {
        label: 'Vendor Management',
        icon: 'fa-solid fa-store',
        route: '/vendor-management',
        allowedUserTypes: [UserType.VENDOR]
      },
      {
        label: 'Section Master',
        icon: 'fa-solid fa-sitemap',
        route: '/department',
        allowedUserTypes: [UserType.CITY_ADMIN, UserType.COMPANY_ADMIN]
      },
      // { 
      //   label: 'Company/Unit List', 
      //   icon: 'fa-solid fa-building', 
      //   route: '/company', 
      //   allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN]  
      // },
      {
        label: 'Designation Master',
        icon: 'fa-solid fa-id-badge',
        route: '/designation',
        allowedUserTypes: [UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.MANAGER]
      },
      {
        label: 'Degree Master',
        icon: 'fa-solid fa-graduation-cap',
        route: '/degree',
        allowedUserTypes: [UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER]
      },
      {
        label: 'Designation Qualification',
        icon: 'fa-solid fa-tasks',
        route: '/DesignationQualification',
        allowedUserTypes: [UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER]
      },
      {
        label: 'Shift Management',
        icon: 'fa-solid fa-clock',
        route: '/shift-management',
        allowedUserTypes: [UserType.CITY_ADMIN, UserType.MANAGER]
      },
      // {
      //   label: 'Employee Report',
      //   icon: 'fa-solid fa-chart-line',
      //   route: '/employee-report',
      //   allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER]  
      // },
      {
        label: 'Employee Payment Entry',
        icon: 'fa-solid fa-receipt',
        route: '/manager-employee-payment',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.MANAGER]
      },
      {
        label: 'Employee Work Report',
        icon: 'fa-solid fa-chart-line',
        route: '/employee-work-report',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.MANAGER, UserType.EMPLOYEE]
      },
      {
        label: 'Vendor Payment Details',
        icon: 'fa-solid fa-receipt',
        route: '/vendor-payment-details',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.VENDOR]
      },
      {
        label: 'Vendor To Employee Payment',
        icon: 'fa-solid fa-receipt',
        route: '/vendor-employee-payment-details',
        allowedUserTypes: [UserType.STATE_ADMIN, UserType.VENDOR]
      },
      {
        label: 'Compensation Request',
        icon: 'fa-solid fa-file-alt',
        route: '/compensation-request',
        allowedUserTypes: [UserType.EMPLOYEE]
      },
      // {
      //   label: 'OD Request',
      //   icon: 'fa-solid fa-file-alt',
      //   route: '/odslipcompanylist',
      //   allowedUserTypes: [ UserType.EMPLOYEE] 
      // },
      // {
      //   label: 'OD Slip Approval',
      //   icon: 'fa-solid fa-check-circle',
      //   route: '/odslipapproval',
      //   allowedUserTypes: [ UserType.MANAGER] 
      // },
      {
        label: 'Leave Request',
        icon: 'fa-solid fa-envelope-open-text',
        route: '/empleaverequest',
        allowedUserTypes: [UserType.EMPLOYEE]
      },
      // {
      //   label: 'Leave Approval',
      //   icon: 'fa-solid fa-thumbs-up',
      //   route: '/Leaveapproval',
      //   allowedUserTypes: [UserType.STATE_ADMIN, UserType.CITY_ADMIN, UserType.COMPANY_ADMIN, UserType.VENDOR, UserType.MANAGER] 
      // },
      {
        label: 'My Employee Profile',
        icon: 'fa-solid fa-id-badge',
        route: '/my-profile',
        allowedUserTypes: [UserType.EMPLOYEE]
      },
      {
        label: 'Payroll Expenditure',
        icon: 'fa-solid fa-line-chart',
        route: '/payroll-expenditure',
        allowedUserTypes: [UserType.MANAGER, UserType.STATE_ADMIN, UserType.CITY_ADMIN]
      },
      // { 
      //   label: 'Future Payroll Needs', 
      //   icon: 'fa-solid fa-line-chart', 
      //   route: '/future-payroll-needs', 
      //   allowedUserTypes: [UserType.MANAGER, UserType.STATE_ADMIN, UserType.CITY_ADMIN] 
      // },
      {
        label: 'Leave And OD Analysis',
        icon: 'fa-solid fa-line-chart',
        route: '/leave-and-od-analysis',
        allowedUserTypes: [UserType.MANAGER, UserType.CITY_ADMIN]
      },
      {
        label: 'Employee Based Reports',
        icon: 'fa-solid fa-line-chart',
        route: '/employee-based-reports',
        allowedUserTypes: [UserType.MANAGER, UserType.STATE_ADMIN, UserType.CITY_ADMIN]
      },
    ];


    return allMenuItems.filter(item => item.allowedUserTypes.includes(userAccessLevel) || item.allowedUserTypes.includes('ALL' as UserType));
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

  firstTimeScreen() {
    this.isCollapsed = true;
    this.sidebarToggled.emit(this.isCollapsed);
  }
}
