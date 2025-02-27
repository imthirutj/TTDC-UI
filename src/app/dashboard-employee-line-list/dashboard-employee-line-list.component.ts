import { Component } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { color } from 'html2canvas/dist/types/css/types/color';
import { UserType } from '../common/user-type.enum';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';

import { AttendanceSummaryDashboard, DashboardData } from '../utils/interface/Dashboard';
import { ChartType } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
@Component({
  selector: 'app-dashboard-employee-line-list',
  templateUrl: './dashboard-employee-line-list.component.html',
  styleUrls: ['./dashboard-employee-line-list.component.css']
})
export class DashboardEmployeeLineListComponent {

  months = myMonths;
  years = myYears;

  UserType = UserType;
  userAccessLevel: any;
  user: any;


  dashboardData: DashboardData = new DashboardData();
  columnWiseTableReport: any = {};

  columnNames = [
    {
      columnName: "ds.designationName",
      label: "Designation",
      key: "designation",
      output: "designationName",
      data: [] as any[]
    },
    {
      columnName: "dp.departmentFName",
      label: "Department",
      key: "department",
      output: "departmentFName",
      data: [] as any[]
    },
    {
      columnName: "dg.degree_Name",
      label: "Qualifications",
      key: "degree_Name",
      output: "degree_Name",
      data: [] as any[]
    },
    {
      columnName: "e.Experience",
      label: "Experience",
      key: "experience",
      output: "Experience",
      data: [] as any[]
    }
  ];

  attendanceSummaryDashboard: AttendanceSummaryDashboard = new AttendanceSummaryDashboard();
  todayAttendanceSummaryDashboard: AttendanceSummaryDashboard = new AttendanceSummaryDashboard();
  paymentGeneratedList: any[] = [];

  filters: any = {
    display: {
      value: 'NONE',
      show: true,
      key: 'display',
      includeInSearchParams: false
    },
    reqStatus:{
      value: '',
      show: true,
      key: 'reqStatus',
      includeInSearchParams: true
    },
    role: { value: '', show: true, key: 'role', includeInSearchParams: true },
    filterRange: {
      value: 1,
      show: false,
      key: 'filterRange',
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
    date: {
      value: new Date().toISOString().split('T')[0], // Default to current month
      show: true,
      key: 'date',
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
      show: true,
      key: 'shiftStatus',
      includeInSearchParams: true
    },
  };

  chartData: any;  // Data to pass to the chart component
  chartOptions: any;  // Options for customization
  chartType: ChartType = 'bar';  // Chart type (can be changed to 'line', 'pie', etc.)


  chartDataForPaymentAmount: any;  // Data to pass to the chart component
  chartOptionsForPaymentAmount: any;  // Options for customization

  unitWiseReport: any[] = [];

  mismatchQualification: any = {};

  loggedInCounts: any = {};
  reports:any[] = [];

  monthlyCounts: any = {};

  constructor(

    private masterDataService: MasterDataService,
    public dataService: DataService,
    private dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute
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

    this.getEmployeeLineListReports();


  }

  getEmployeeLineListReports() {
    const payload = this.dataService.getPayloadValue(this.filters);

    this.dashboardService.getEmployeeLineListReports(payload).subscribe((response: any) => {
      if (response.success) {
        this.reports = response.data;
      }
    });
  }





}
