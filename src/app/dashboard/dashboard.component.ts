import { Component } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { color } from 'html2canvas/dist/types/css/types/color';
import { UserType } from '../common/user-type.enum';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { DashboardService } from './dashboard.service';
import { AttendanceSummaryDashboard, DashboardData } from '../utils/interface/Dashboard';
import { ChartType } from 'chart.js';
import { Router } from '@angular/router';

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

  chartData: any;  // Data to pass to the chart component
  chartOptions: any;  // Options for customization
  chartType: ChartType = 'bar';  // Chart type (can be changed to 'line', 'pie', etc.)


  chartDataForPaymentAmount: any;  // Data to pass to the chart component
  chartOptionsForPaymentAmount: any;  // Options for customization

  unitWiseReport: any[] = [];

  mismatchQualification: any = {};

  loggedInCounts: any = {};

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

  getUnitWiseReport() {
    const payload = this.dataService.getPayloadValue(this.filters);

    this.masterDataService.getUnitWiseReport(payload).subscribe(
      (response: any) => {
        this.unitWiseReport = response.data;
      }
    );
  }
  // Event handler for filter change
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.search();
  }
  search() {
    this.getDashboardCount();
    this.getPaymentGeneratedList();
  //  this.getAllReports();
   // this.getExpQualMismatchCount();
    this.getLoggedInCounts();
    this.getMonthlyPresentAbsentCount();
    this.getUnitWiseReport();

  }

  getExpQualMismatchCount() {
    const payload = this.dataService.getPayloadValue(this.filters);

    this.dashboardService.getExpQualMismatchCount(payload).subscribe((response: any) => {
      if (response.success) {
        this.mismatchQualification = response.data;
      }
    });
  }

  getLoggedInCounts() {
    const payload = this.dataService.getPayloadValue(this.filters);

    this.dashboardService.getLoggedInCounts(payload).subscribe((response: any) => {
      if (response.success) {
        this.loggedInCounts = response.data;
      }
    });
  }

  getMonthlyPresentAbsentCount() {
    const payload = this.dataService.getPayloadValue(this.filters);

    this.dashboardService.getMonthlyPresentAbsentCount(payload).subscribe((response: any) => {
      if (response.success) {
        this.monthlyCounts = response.data;
      }
    });
  }

  getDashboardCount() {
    const payload = this.dataService.getPayloadValue(this.filters);


    this.dashboardService.getDashboardData(payload).subscribe((response: any) => {
      if (response.success) {
        this.dashboardData = response.data.dashboardObj;
        this.attendanceSummaryDashboard = response.data.attendanceSummary;
        this.todayAttendanceSummaryDashboard = response.data.todayattendanceSummary;
      }
    })
  }

  getPaymentGeneratedList() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.dashboardService.getPaymentGeneratedList(payload).subscribe((response: any) => {
      if (response.success) {
        this.paymentGeneratedList = response.data;
        //this.prepareChartData();
      }
    })
  }


  prepareChartData() {
    const monthsWithYear = this.paymentGeneratedList.map(item => {
      const monthName = this.months[item.month - 1].name;
      return `${monthName} ${item.year}`;
    });
    const paymentGenerated = this.paymentGeneratedList.map(item => item.paymentGeneratedCount);
    const paymentNotGenerated = this.paymentGeneratedList.map(item => item.paymentNotGeneratedCount);

    // Set chart data and options
    this.chartData = {
      labels: monthsWithYear,
      datasets: [
        {
          label: 'Payment Generated',
          data: paymentGenerated,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Payment Not Generated',
          data: paymentNotGenerated,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    };





    //Chart2
    // Prepare data for the second chart (Payment Amount)
    const paymentAmount = this.paymentGeneratedList.map(item => item.totalAmount);

    // Set chart data for payment amount
    this.chartDataForPaymentAmount = {
      labels: monthsWithYear,
      datasets: [
        {
          label: 'Payment Amount',
          data: paymentAmount,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Set color for payment amount
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          type: 'line'  // Render this as a line chart
        }
      ]
    };

    this.chartOptionsForPaymentAmount = {
      responsive: true,
      scales: {
        x: { beginAtZero: true },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: number) {
              return `₹ ${value.toLocaleString()}`;
            }
          }
        }
      }
    };
  }

  getTotal(field: string): number {
    return this.paymentGeneratedList.reduce((sum, record) => sum + (record[field] || 0), 0);
  }

  getRepTotal(data: any[]): number {
    return data.reduce((sum, row) => sum + (row.Total || 0), 0);
  }

  getColumnWiseTableReport(obj: any) {

    const payload = this.dataService.getPayloadValue(this.filters);
    const fpayload = {
      ...payload,
      columnName: obj.columnName
    }
    this.dashboardService.getColumnWiseTableReport(fpayload).subscribe((response: any) => {
      if (response.success) {
        obj.data = response.data;
      }
    })
  }

  getAllReports() {

    this.columnWiseTableReport = {};
    this.columnNames.forEach((columnName: any) => {
      this.getColumnWiseTableReport(columnName);

    });
    console.log('All Reports:', this.columnNames);
  }

  getReportKeys() {
    return Object.keys(this.columnWiseTableReport);
  }


  showFullTable: boolean = false;

  toggleTable() {
    this.showFullTable = !this.showFullTable;
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


    Object.assign(filters, {filterRange: 0});
    if (applyFilter === 'LOGGED_IN' || applyFilter === 'NOT_LOGGED_IN') {
      Object.assign(filters, {
        month: this.dataService.getCurrentPayrollMonth(),
        year: new Date().getFullYear(),
        logType: applyFilter
      });
    }

    if(applyFilter === 'PAYMENT_GENERATED') {
      Object.assign(filters, {
        month: this.dataService.getCurrentPayrollMonth(),
        year: new Date().getFullYear(),
      });
    }
    if(applyFilter === 'OD') {
      Object.assign(filters, {
        month: this.dataService.getCurrentPayrollMonth(),
        year: new Date().getFullYear(),
        logType:'OD'
      });
    }
    if(applyFilter === 'LEAVE') {
      Object.assign(filters, {
        month: this.dataService.getCurrentPayrollMonth(),
        year: new Date().getFullYear(),
        logType:'LEAVE'
      });
    }

  


    // Ensure setFilters completes before navigation
    Promise.resolve(this.dataService.setFilters(filters)).then(() => {
      this.router.navigate([url], { queryParams: { passedFilter: 1 } });
    });
  }



  //#endRegion

}
