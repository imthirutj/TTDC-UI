import { Component } from '@angular/core';
import { UserType } from 'src/app/common/user-type.enum';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ReportService } from '../report.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-salary-summary',
  templateUrl: './salary-summary.component.html',
  styleUrls: ['./salary-summary.component.css']
})
export class SalarySummaryComponent {
  UserType = UserType;
  userAccessLevel: any;
  user: any;

  ReportData: any = [];
  totalCounts : number=0;
  filters: any = {
    role: { value: '', show: false, key: 'role', includeInSearchParams: true },

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
    vendorId:{
      value: '',
      show: true,
      key: 'vendorId',
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
    this.fetchSalarySummaryReport();

  }

  fetchSalarySummaryReport() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.reportService.getSalarySummaryReport(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.ReportData = response.data;
        } else {
          this.ReportData = [];
        }
      },
      (error) => {
        console.error('Error fetching salary summary report:', error);
        this.ReportData = [];
      }
    );
}

getTotal(obj: any, key: string): number {
    return obj.companies.reduce((sum: number, company: any) => sum + (company[key] || 0), 0);
}


}
