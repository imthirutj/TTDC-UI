import { Component, OnInit } from '@angular/core';
import { UserType } from 'src/app/common/user-type.enum';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ReportService } from '../report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeWorkDetailsComponent } from 'src/app/employee-work-details/employee-work-details.component';
import { EmployeeWorkDetailsService } from 'src/app/employee-work-details/employee-work-details.service';

@Component({
  selector: 'app-shift-report',
  templateUrl: './shift-report.component.html',
  styleUrls: ['./shift-report.component.css']
})
export class ShiftReportComponent {

  UserType = UserType;
    userAccessLevel: any;
    user: any;
  
    Reports: any = [];
    totalCounts : number=0;
    pageAttributes = {
      currentPage: 1,
      totalPages: 1,
      pageSize: 1200
    }
    
  shiftTypes: string[] = [
    'WEEKOFF',
    // 'HOLIDAY', 
    'MORNING',
    'AFTERNOON',
    'NIGHT',
    'GENERAL',
    'BREAK'
  ];
    selectedTab: string = '';

    filters: any = {
      role: { value: '', show: false, key: 'role', includeInSearchParams: true },
      shiftStatus: {
        value: '',
        show: true,
        key: 'shiftStatus',
        includeInSearchParams: true
      },
      fromDate: {
        value: new Date().toISOString().split('T')[0], // Default to current month
        show: true,
        key: 'fromDate',
        includeInSearchParams: true
      },
      toDate: {
        value: new Date().toISOString().split('T')[0], // Default to current year
        show: true,
        key: 'toDate',
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
      employeeName: {
        value: '',
        show: true,
        key: 'employeeName',
        includeInSearchParams: true
      },
      employeeCode: {
        value: '',
        show: true,
        key: 'employeeCode',
        includeInSearchParams: true
      },
  
    };
    constructor(
  
      private masterDataService: MasterDataService,
      public dataService: DataService,
      private reportService: ReportService,
      private router: Router,
      private route:ActivatedRoute,
       private employeeWorkDetailsService :EmployeeWorkDetailsService
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
      this.route.queryParams.subscribe(params => {
        if (params['passedFilter'] == '1') {
          this.dataService.applyFilter(this.filters).then(() => {
            this.search();
          });
        } else {
          this.search();
        }
      });
    }
    search() {
      this.fetchReport();
  
    }
  
    fetchReport() {
      const payload = this.dataService.getPayloadValue(this.filters);
  
      const fpayload = {
        ...payload,
        PageNumber: this.pageAttributes.currentPage,
        pageSize: this.pageAttributes.pageSize
      }
  
      this.reportService.getCompanyWiseEmpShiftList(fpayload).subscribe(
        (response:any)=>{
          this.Reports = response.data;
          this.pageAttributes.totalPages = response.totalPages;
          this.totalCounts = response.totalCount;
        }
      );
    }
  
   
}
