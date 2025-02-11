import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from 'src/app/common/user-type.enum';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-payslip-not',
  templateUrl: './payslip-not.component.html',
  styleUrls: ['./payslip-not.component.css']
})
export class PayslipNotComponent {
  UserType = UserType;
  userAccessLevel: any;
  user: any;

  payId: any
  allEmployees: any[] = [];
  Employees: any[] = [];
  payslips: any[] = []
  employee: any;

  pageAttributes = {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  }

  filters: any = {
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
  };

  constructor(private masterDataService: MasterDataService,
    private route: ActivatedRoute, private router: Router,
    private dataService: DataService
  ) {
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);
    });

  }
  ngOnInit(): void {
    //this.getEmployeeList();
    //his.dataService.openConfirmationDialog("ok");
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.pageAttributes.currentPage = 1;
    this.getEmployeeList();
  }

  search() {
    this.pageAttributes.currentPage = 1;
    this.getEmployeeList();
  }
  loop_id: number = 0
  submit_vendor_wise() {

    const payload = this.dataService.getPayloadValue(this.filters);

    this.masterDataService.generatePayAll(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.openConfirmationDialog(response.message);
        }
        else{
          this.dataService.openConfirmationDialog(response.message);
        }
      });
  }


  getEmployeeList(): void {
   
    const payload = this.dataService.getPayloadValue(this.filters);
    console.log(this.filters);

    const fpaylod={
      ...payload,
      pageNumber: this.pageAttributes.currentPage,
      type:2
    }
    this.Employees =[];
    this.masterDataService.getpayslipList(fpaylod).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success ) {
          this.Employees = response.data.pendingRecords;
         
        }
      }
    );
  }

  // paginate(): void {
  //   const startIndex = (this.pageAttributes.currentPage - 1) * this.pageAttributes.itemsPerPage;
  //   const endIndex = startIndex + this.pageAttributes.itemsPerPage;
  //   this.Employees = this.allEmployees.slice(startIndex, endIndex);
  // }

  show_list_slip(obj_clicked: any) {
    this.employee = obj_clicked
    this.masterDataService.payslips('?Month=' + this.filters.selectedMonth.value + '&Year=' + this.filters.selectedYear.value + '&EmpId=' + obj_clicked.employeeId + '').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success ) {
          this.payslips = response.data.pendingRecords;
        }
      }
    );
  }
  generate_payslip(obj_clicked: any) {
    let objec = { EmpId: obj_clicked.employeeId, employeeName: obj_clicked.employeeName }
    const payload = {
      EmpId: obj_clicked.employeeId,
      Month: this.filters.selectedMonth.value,
      Year: this.filters.selectedYear.value
    }
    this.masterDataService.generatePay(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.openConfirmationDialog(response.message);
          this.router.navigate(['/payslip-records']);
        } else {
          this.dataService.openConfirmationDialog(response.message);
        }
      }
    );
  }
}

