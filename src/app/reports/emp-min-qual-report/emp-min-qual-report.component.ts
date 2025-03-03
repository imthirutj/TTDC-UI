import { Component, OnInit } from '@angular/core';
import { UserType } from 'src/app/common/user-type.enum';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ReportService } from '../report.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-emp-min-qual-report',
  templateUrl: './emp-min-qual-report.component.html',
  styleUrls: ['./emp-min-qual-report.component.css']
})
export class EmpMinQualReportComponent {

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


  filters: any = {
    selectedMonth: {
      value: Number(new Date().getMonth()) + 1, // Default to current month
      show: false,
      key: 'month',
      includeInSearchParams: false
    },
    selectedYear: {
      value: new Date().getFullYear(), // Default to current year
      show: false,
      key: 'year',
      includeInSearchParams: false
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
    catId: {
      value: '',
      show: true,
      key: 'catId',
      includeInSearchParams: true
    },
    employeeId: {
      value: '',
      show: false,
      key: 'employeeId',
      includeInSearchParams: false
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
    vendorId: {
      value: '',
      show: true,
      key: 'vendorId',
      includeInSearchParams: true
    },
    qualificationMismatched: {
      value: '0',
      show: false,
      key: 'qualificationMismatched',
      includeInSearchParams: false
    },
    loggedInType: {
      value: '0',
      show: false,
      key: 'loggedInType',
      includeInSearchParams: true
    },
    activeStatus: {
      value: 'ACTIVE',
      show: true,
      key: 'activeStatus',
      includeInSearchParams: true
    }
  };
  constructor(

    private masterDataService: MasterDataService,
    public dataService: DataService,
    private reportService: ReportService,
    private router: Router,
    private route:ActivatedRoute
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
    this.reportService.getCompanyWiseEmpQualfList(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.Reports = response.data;
        }
      }
    );
  }

  getTotalEmployees(): number {
    return this.Reports.reduce((sum: number, record: any) => {
      return sum + record.employees.length;
    }, 0);
  }
  
  getTotalEmployeesForUnit(unit: any): number {
    return unit.employees ? unit.employees.length : 0;
  }
  

}
