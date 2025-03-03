import { Component, OnInit } from '@angular/core';
import { UserType } from 'src/app/common/user-type.enum';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ReportService } from '../report.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-log-not-log-report',
  templateUrl: './log-not-log-report.component.html',
  styleUrls: ['./log-not-log-report.component.css']
})
export class LogNotLogReportComponent {
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
  selectedTab: string = 'LOGGED_IN';

  filters: any = {
    role: { value: '', show: false, key: 'role', includeInSearchParams: true },

    reqStatus: {
      value: 'LOGGED_IN',
      show: true,
      key: 'reqStatus',
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
    this.fetchReport();

  }

  fetchReport() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.reportService.getLoggedNotLoggedRep(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.Reports = response.data;
          this.totalCounts= response.totalUniqueDesignation;
        }
      }
    );
  }

  getTotalEmployees(): number {
    return this.Reports.reduce((sum: number, record: any) => {
      return sum + record.employees.length;
    }, 0);
  }
  
  

}
