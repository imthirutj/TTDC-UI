import { Component } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { color } from 'html2canvas/dist/types/css/types/color';
import { UserType } from '../common/user-type.enum';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { DashboardService } from './dashboard.service';
import { DashboardData } from '../utils/interface/Dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  months = myMonths;
  years = myYears;

  UserType = UserType;
  userAccessLevel: any;
  user: any;


  dashboardData: DashboardData = new DashboardData();


  filters: any = {
    role: { value: '', show: true, key: 'role', includeInSearchParams: true },
    selectedMonth: {
      value: Number(new Date().getMonth()) + 1, // Default to current month
      show: true,
      key: 'month',
      includeInSearchParams: true
    },
    selectedYear: {
      value: new Date().getFullYear(), // Default to current year
      show: true,
      key: 'year',
      includeInSearchParams: true
    },
    cityId: {
      value: '',
      show: true,
      key: 'cityId',
      includeInSearchParams: true
    },
    companyId: {
      value: '',
      show: true,
      key: 'compId',
      includeInSearchParams: true
    },
    designationId: {
      value: '',
      show: true,
      key: 'designationId',
      includeInSearchParams: true
    },
    deptId: {
      value: '',
      show: true,
      key: 'deptId',
      includeInSearchParams: true
    },
    vendorId: {
      value: '',
      show: true,
      key: 'vendorId',
      includeInSearchParams: true
    },
  };


  constructor(

    private masterDataService: MasterDataService,
    private dataService: DataService,
    private dashboardService: DashboardService
  ) {
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);


    });
  }

  ngOnInit() {
   
  }

  getDashboardCount() {
    const payload = this.dataService.getPayloadValue(this.filters);


    this.dashboardService.getDashboardData(payload).subscribe((response: any) => {
      if (response.success) {
        if (this.userAccessLevel == UserType.STATE_ADMIN) {
          this.dashboardData.state = response.data;
        }
        else if (this.userAccessLevel == UserType.MANAGER) {
          this.dashboardData.manager = response.data;
        }
        else if (this.userAccessLevel == UserType.VENDOR) {
          this.dashboardData.vendor = response.data;
        }
        else if (this.userAccessLevel == UserType.EMPLOYEE) {
          this.dashboardData.employee = response.data;
        }
      }
    })
  }



  // Event handler for filter change
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getDashboardCount();
  }
  search(){
    this.getDashboardCount();
  }
}
