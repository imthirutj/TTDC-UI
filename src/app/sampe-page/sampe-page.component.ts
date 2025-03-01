import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Action } from '../common/action.enum';
import { DataService } from '../data.Service';
import { Designation } from '../utils/interface/Designation';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from '../common/user-type.enum';
import { ReportService } from '../reports/report.service';


@Component({
  selector: 'app-sampe-page',
  templateUrl: './sampe-page.component.html',
  styleUrls: ['./sampe-page.component.css']
})
export class SampePageComponent {

   UserType = UserType;
    userAccessLevel: any;
    user: any;
  
    filters: any = {
      role: { value: '', show: false, key: 'role', includeInSearchParams: true },
      filterRange: {
        value: 1,
        show: false,
        key: 'filterRange',
        includeInSearchParams: true
      },
      selectedMonth: {
        value: Number(new Date().getMonth()) + 1,
        show: true,
        key: 'month',
        includeInSearchParams: true
      },
      selectedYear: {
        value: new Date().getFullYear(),
        show: true,
        key: 'year',
        includeInSearchParams: true
      },
  
      fromMonth: {
        value: Number(new Date().getMonth()) + 1, // Default to current month
        show: true,
        key: 'fromMonth',
        includeInSearchParams: true
      },
      fromYear: {
        value: new Date().getFullYear(), // Default to current year
        show: true,
        key: 'fromYear',
        includeInSearchParams: true
      },
      toMonth: {
        value: Number(new Date().getMonth()) + 1, // Default to current month
        show: true,
        key: 'toMonth',
        includeInSearchParams: true
      },
      toYear: {
        value: new Date().getFullYear(), // Default to current year
        show: true,
        key: 'toYear',
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
      employeeId: {
        value: '',
        show: false,
        key: 'EmployeeId',
        includeInSearchParams: false
      },
      vendorId: {
        value: '',
        show: true,
        key: 'vendorId',
        includeInSearchParams: true
      },
      shiftStatus: {
        value: '',
        show: false,
        key: 'shiftStatus',
        includeInSearchParams: false
      },
    };
    constructor(
  
      private masterDataService: MasterDataService,
      public dataService: DataService,
      private reportService: ReportService,
      private router: Router
    ) {
      this.dataService.asyncGetUser().then((user: any) => {
        this.user = user;
        this.userAccessLevel = user.role;
        console.log('User Access Level:', this.userAccessLevel);
  
  
      });
    }

    ngOnInit() {

    }
    onFilterChanged(event: any) {
      console.log('Filters updated in parent component:', this.filters);
      this.search();
    }
    search() {
     
  
    }
}
