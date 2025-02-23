import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from 'src/app/data.Service';
import { Employee } from 'src/app/utils/interface/Employee';
import { Vendor } from 'src/app/utils/interface/vendor';
import { Category, City, Company, Department, Designation } from 'src/app/utils/interface/masters';
import { UserType } from 'src/app/common/user-type.enum';
import { Action, ModuleType } from 'src/app/common/action.enum';
import { ModuleTypeLabels } from 'src/app/common/labels';
import { BankDetails } from 'src/app/utils/interface/BankDetails';
import { WageDetails } from 'src/app/utils/interface/WageDetails';
import { UnitReports } from '../utils/interface/UnitReports';
import { EmployeeWorkDetailsService } from '../employee-work-details/employee-work-details.service';
import { EmployeeReport } from '../utils/interface/EmployeeReport';


@Component({
  selector: 'app-employee-based-reports',
  templateUrl: './employee-based-reports.component.html',
  styleUrls: ['./employee-based-reports.component.css']
})
export class EmployeeBasedReportsComponent {

    Action = Action;
    ModuleType = ModuleType;
    ModuleTypeLabels = ModuleTypeLabels;
    UserType = UserType;
    user: any;
    userAccessLevel: any;
  
    Reports: EmployeeReport[] = [];
  
  
    modalAnalysis={
      show: false,
      title:'Generate Analysis',
      reports: {}
    }
  
    pageAttributes = {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10
    }

  
    filters: any = {
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
      leaveReqStatus: {
        value: 'ALL',
        show: true,
        key: 'leaveReqStatus',
        includeInSearchParams: true
      },


     
    };
  
    constructor(
      private masterDataService: MasterDataService,
      public dataService: DataService,
      private employeeWorkDetailsService: EmployeeWorkDetailsService
    ) {
      this.dataService.asyncGetUser().then((user: any) => {
        this.user = user;
        this.userAccessLevel = user.role;
        console.log('User Access Level:', this.userAccessLevel);
      });
    }
  
    ngOnInit(): void {
  
    }
  
    
    onFilterChanged(event: any) {
      console.log('Filters updated in parent component:', this.filters);
      this.pageAttributes.currentPage = 1;
      this.fetchEmployeeBasedReports();
    }
  
    search() {
      this.fetchEmployeeBasedReports();
    }
  
    fetchEmployeeBasedReports() {
      const payload = this.dataService.getPayloadValue(this.filters);

      const fpayload = {
        ...payload,
        PageNumber: this.pageAttributes.currentPage,
        pageSize: this.pageAttributes.pageSize
      }
  
      this.employeeWorkDetailsService.getEmployeeBasedReports(fpayload).subscribe(
        (response:any)=>{
          this.Reports = response.data;
          this.pageAttributes.totalPages = response.totalPages;
        }
      );
    }

    downloadExcel() {
      const payload = this.dataService.getPayloadValue(this.filters);
      if (!payload) {
        console.error("Payload is null or undefined");
        return;
      }

      const fpayload = {
        ...payload,
        isDownload:1
      }
    
      const queryParams = this.dataService.buildQueryParams(fpayload);
      if (!queryParams) {
        console.error("Query parameters are null or undefined");
        return;
      }
    
      const url = `${this.employeeWorkDetailsService?.apiUrl}Reports/EmployeeBased?${queryParams}`;
      if (url) {
        window.open(url, '_blank')?.focus();
      } else {
        console.error("URL is null or undefined");
      }
    }
    
    
    
}
