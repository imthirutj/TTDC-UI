import { Component, OnInit } from '@angular/core';
import { UserType } from 'src/app/common/user-type.enum';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ReportService } from '../report.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-department-report',
  templateUrl: './department-report.component.html',
  styleUrls: ['./department-report.component.css']
})
export class DepartmentReportComponent {
  UserType = UserType;
  userAccessLevel: any;
  user: any;

  deptWiseReportData: any = [];
  totalCounts : number=0;
  filters: any = {
    role: { value: '', show: false, key: 'role', includeInSearchParams: true },


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
    this.fetchDeptWiseReport();

  }

  fetchDeptWiseReport() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.reportService.getDeptWiseReport(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.deptWiseReportData = response.data;
         // this.totalCounts= response.totalUniqueDesignation;
        }
      }
    );
  }

  getTotal(obj: any, key: string): number {
    return obj.companies.reduce((sum:any, emp:any) => sum + (emp[key] || 0), 0);
  }
}
