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


  allMenuItems = [ ];

  constructor(private dataService: DataService,
    private router: Router
  ) {
     // Automatically collapse on mobile view
     if (window.innerWidth <= 768) {
      this.isCollapsed = true;
    }
  }
  

  ngOnInit(): void {
    this.menuItems = this.getMenuItemsBasedOnUserType(this.userType);
  }

  getMenuItemsBasedOnUserType(userType: any): any[] {
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
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Pay Generated', 
        icon: 'fa-folder', 
        route: `/payslip-records`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Pay Not Generated', 
        icon: 'fa-folder', 
        route: `/payslip-records-waiting`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'State List', 
        icon: 'fa-folder', 
        route: `/state`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'city List', 
        icon: 'fa-folder', 
        route: `/city`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Category List', 
        icon: 'fa-folder', 
        route: `/category`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Department', 
        icon: 'fa-folder', 
        route: `/department`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Company List', 
        icon: 'fa-folder', 
        route: `/company`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Designation List', 
        icon: 'fa-folder', 
        route: `/designation`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Degree List', 
        icon: 'fa-folder', 
        route: `/degree`, 
        allowedUserTypes: [ 'ALL'] 
      },
      { 
        label: 'Designation Qualification', 
        icon: 'fa-folder', 
        route: `/DesignationQualification`, 
        allowedUserTypes: [ 'ALL'] 
      },
      {
        label: 'Shift Management',
        icon: 'fa-folder',
        route: '/shift-management',
        allowedUserTypes: ['ALL'] 
      },
      {
        label: 'Employee Report',
        icon: 'fa-folder',
        route: '/employee-report',
        allowedUserTypes: ['ALL'] 
      },
      {
        label: 'Vendor',
        icon: 'fa-folder',
        route: '/vendor',
        allowedUserTypes: ['ALL'] 
      },
    
      {
        label: 'OD Slip',
        icon: 'fa-folder',
        route: '/odslipcompanylist',
        allowedUserTypes: ['ALL'] 
      },
      {
        label: 'OD Slip Approval',
        icon: 'fa-folder',
        route: '/odslipapproval',
        allowedUserTypes: ['ALL'] 
      },
      {
        label: 'Leave Request',
        icon: 'fa-folder',
        route: '/empleaverequest',
        allowedUserTypes: ['ALL'] 
      },
      {
        label: 'Leave Approval',
        icon: 'fa-folder',
        route: '/Leaveapproval',
        allowedUserTypes: ['ALL'] 
      }
    
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
