import { Component } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { color } from 'html2canvas/dist/types/css/types/color';
import { UserType } from '../common/user-type.enum';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { DashboardService } from './dashboard.service';
import { DashboardData } from '../utils/interface/Dashboard';
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

  // Event handler for filter change
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getDashboardCount();
    this.getPaymentGeneratedList();
  }
  search() {
    this.getDashboardCount();
    this.getPaymentGeneratedList();
  }

  getDashboardCount() {
    const payload = this.dataService.getPayloadValue(this.filters);


    this.dashboardService.getDashboardData(payload).subscribe((response: any) => {
      if (response.success) {
       this.dashboardData = response.data;
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

}
