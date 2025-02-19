import { Component } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { color } from 'html2canvas/dist/types/css/types/color';
import { UserType } from '../common/user-type.enum';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { DashboardService } from './dashboard.service';
import { AttendanceSummaryDashboard, DashboardData } from '../utils/interface/Dashboard';
import { ChartType } from 'chart.js';

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
  columnWiseTableReport:any={};

  columnNames = [
    {
      columnName: "ds.designationName",
      label: "Designation",
      key: "designation",
      output: "designationName",
      data:[] as any[]
    },
    {
      columnName: "dp.departmentFName",
      label: "Department",
      key: "department",
      output: "departmentFName",
      data:[] as any[]
    },
    {
      columnName: "dg.degree_Name",
      label: "Qualifications",
      key: "degree_Name",
      output: "degree_Name",
      data:[] as any[]
    },
    {
      columnName: "e.Experience",
      label: "Experience",
      key: "experience",
      output: "Experience",
      data:[] as any[]
    }
  ];

  attendanceSummaryDashboard: AttendanceSummaryDashboard = new AttendanceSummaryDashboard();
  todayAttendanceSummaryDashboard: AttendanceSummaryDashboard = new AttendanceSummaryDashboard();
  paymentGeneratedList: any[] = [];

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
    employeeId:{
      value: '',
      show: true,
      key: 'EmployeeId',
      includeInSearchParams: true
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

  unitWiseReport:any[]=[];

  mismatchQualification: any= {} ;

  loggedInCounts:any ={};

  constructor(

    private masterDataService: MasterDataService,
    public dataService: DataService,
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

  getUnitWiseReport(){
    const payload = this.dataService.getPayloadValue(this.filters);

    this.masterDataService.getUnitWiseReport(payload).subscribe(
      (response:any)=>{
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
    this.getAllReports();
    this.getExpQualMismatchCount();
    this.getLoggedInCounts();
    this.getUnitWiseReport();

  }

  getExpQualMismatchCount(){
    const payload = this.dataService.getPayloadValue(this.filters);

    this.dashboardService.getExpQualMismatchCount(payload).subscribe((response: any) => {
      if (response.success) {
        this.mismatchQualification = response.data;
      }
    });
  }

  getLoggedInCounts(){
    const payload = this.dataService.getPayloadValue(this.filters);

    this.dashboardService.getLoggedInCounts(payload).subscribe((response: any) => {
      if (response.success) {
        this.loggedInCounts = response.data;
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
        this.prepareChartData();
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
    const fpayload ={
      ...payload,
      columnName: obj.columnName
    }
    this.dashboardService.getColumnWiseTableReport(fpayload).subscribe((response: any) => {
      if (response.success) {
        obj.data = response.data;
      }
    })
  }

  getAllReports(){
    
    this.columnWiseTableReport = {};
    this.columnNames.forEach((columnName:any) => {
      this.getColumnWiseTableReport(columnName);

    });
    console.log('All Reports:', this.columnNames);
  }

  getReportKeys() {
    return Object.keys(this.columnWiseTableReport);
  }


  showFullTable:boolean =  false;

  toggleTable() {
    this.showFullTable=!this.showFullTable;
  }

}
