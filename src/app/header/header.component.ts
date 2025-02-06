import { Component, HostListener, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterDataService } from '../services/master-data.service';
import { LoginService } from '../login/login.service';
import { DataService } from '../data.Service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showProfileDialog = false;
  isEditMode = false;  // Flag for toggling between view and edit mode
  userData: any = {};

  screenWidth: number = window.innerWidth; 
  groupedDepartments: any[] = [];

  constructor(private fb: FormBuilder,
    private zone: NgZone,
    private masterDataService: MasterDataService,
    private loginService: LoginService,
    public dataService: DataService,
    private userService: UserService) {

    this.getUserDetails();
  }

  ngOnInit(): void {
    this.updateScreenWidth();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateScreenWidth();
  }

  private updateScreenWidth(): void {
    this.screenWidth = window.innerWidth;
  }

  isMobile(): boolean {
    return this.screenWidth < 768; // Define mobile view breakpoint
  }
  getUserDetails() {
    this.userService.getUserDetails(this.dataService.getUserId()).subscribe(
      (response:any)=>{
        if(response.success){
          this.userData = response.data;
          this.groupByCompany();
        }
      }
    );
  }

  logout() {
    console.log('Logging out...');
    this.dataService.logout();
  }

  toggleProfileDialog() {
    this.zone.run(() => {
      this.showProfileDialog = !this.showProfileDialog;
    });
  }

  onSubmit() {
    // Handle profile submission here (e.g., save changes to backend)
    console.log('Profile updated:', this.userData);
    this.isEditMode = false;  // Exit edit mode after submission
  }

  groupByCompany() {
    const grouped = this.userData.companyDepartmentList.reduce((acc:any, curr:any) => {
      const company = acc.find((item: any) => item.companyName === curr.companyName);
      if (company) {
        company.departments.push(curr.departmentName);
      } else {
        acc.push({
          companyName: curr.companyName,
          departments: [curr.departmentName]
        });
      }
      return acc;
    }, []);
    this.groupedDepartments = grouped;
  }
}
