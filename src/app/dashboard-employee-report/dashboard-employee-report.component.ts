import { Component } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { color } from 'html2canvas/dist/types/css/types/color';
import { UserType } from '../common/user-type.enum';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';

import { AttendanceSummaryDashboard, DashboardData } from '../utils/interface/Dashboard';
import { ChartType } from 'chart.js';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard-employee-report',
  templateUrl: './dashboard-employee-report.component.html',
  styleUrls: ['./dashboard-employee-report.component.css']
})
export class DashboardEmployeeReportComponent {

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
    role: { value: '', show: true, key: 'role', includeInSearchParams: true },
    filterRange: {
      value: 1,
      show: false,
      key: 'filterRange',
      includeInSearchParams: true
    },

    date: {
      value: new Date().toISOString().split('T')[0], // Default to current month
      show: true,
      key: 'date',
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

  };

  chartData: any;  // Data to pass to the chart component
  chartOptions: any;  // Options for customization
  chartType: ChartType = 'bar';  // Chart type (can be changed to 'line', 'pie', etc.)


  chartDataForPaymentAmount: any;  // Data to pass to the chart component
  chartOptionsForPaymentAmount: any;  // Options for customization

  unitWiseReport: any[] = [];

  mismatchQualification: any = {};

  loggedInCounts: any = {};
  reports: any = {};

  monthlyCounts: any = {};

  constructor(

    private masterDataService: MasterDataService,
    public dataService: DataService,
    private dashboardService: DashboardService,
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


  // Event handler for filter change
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.search();
  }
  search() {

    this.getEmployeeDashboardReports();
    this.getLoggedInCounts();


  }

  getLoggedInCounts() {
    const payload = this.dataService.getPayloadValue(this.filters);

    this.dashboardService.getLoggedInCounts(payload).subscribe((response: any) => {
      if (response.success) {
        this.loggedInCounts = response.data;
      }
    });
  }

  getEmployeeDashboardReports() {
    const payload = this.dataService.getPayloadValue(this.filters);

    this.dashboardService.getDashboardReportCount(payload).subscribe((response: any) => {
      if (response.success) {
        this.reports = response.data;
      }
    });
  }

  selectedDate: string = ''; // Stores the selected date
  applyFilterType: string = ''; // Stores filter type


  modalDate = {
    show: false,
    title: 'Pick Date',

  }
  // Opens Bootstrap Modal and sets filter type
  openDateModal(filterType: string) {
    this.applyFilterType = filterType;
    this.modalDate.show = true;
    this.filters.date.value = new Date().toISOString().split('T')[0];

  }
  closeDateModal(){
    this.modalDate.show = false;
    this.applyFilterType='';
    this.filters.date.value = new Date().toISOString().split('T')[0];
  }


  //#region Navigation
  //#region Navigation
  applyFilterAndNavigate(url: string, applyFilter: string = '') {
    const filters = Object.keys(this.filters).reduce((acc, key) => {
      const filterKey = this.filters[key]?.key; // Get the key field value
      if (filterKey) {
        acc[filterKey] = this.filters[key]?.value ?? ''; // Store using key field value
      }
      return acc;
    }, {} as any);


    Object.assign(filters, { filterRange: 0 });
    if (applyFilter === 'LOGGED_IN' || applyFilter === 'NOT_LOGGED_IN') {
      Object.assign(filters, {
        date: this.filters.date.value,
        reqStatus: applyFilter
      });
    }

    if (applyFilter === 'OD') {
      Object.assign(filters, {
        fromDate: this.filters.fromDate.value,
        toDate: this.filters.toDate.value,
        reqStatus: 'OD'
      });
    }
    if (applyFilter === 'LEAVE') {
      Object.assign(filters, {
        fromDate: this.filters.fromDate.value,
        toDate: this.filters.toDate.value,
        reqStatus: 'LEAVE'
      });
    }
    // Ensure setFilters completes before navigation
    Promise.resolve(this.dataService.setFilters(filters)).then(() => {
      this.router.navigate([url], { queryParams: { passedFilter: 1 } });
    });
  }



  //#endRegion

}
