import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-payslip-not',
  templateUrl: './payslip-not.component.html',
  styleUrls: ['./payslip-not.component.css']
})
export class PayslipNotComponent {
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
    employeeName:{
      value: '',
      show: true,
      key: 'employeeName',
      includeInSearchParams: true
    },
    employeeCode:{
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
  ) { }
  ngOnInit(): void {
    //this.getEmployeeList();

  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getEmployeeList();
  }

  search() {
    this.getEmployeeList();
  }
  loop_id: number = 0
  submit_vendor_wise() {

    const payload = this.dataService.getPayloadValue(this.filters);

    this.masterDataService.generatePayAll(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success )
        {
          this.dataService.showSnackBar(response.message);
        }
      });
  }


  getEmployeeList(): void {
    this.pageAttributes.currentPage = 1;
    const payload = this.dataService.getPayloadValue(this.filters);
    console.log(this.filters)
    this.masterDataService.getpayslipList(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data.pendingRecords)) {
          this.allEmployees = response.data.pendingRecords;
          this.pageAttributes.totalPages = Math.ceil(this.allEmployees.length / this.pageAttributes.itemsPerPage);
          this.paginate();
        } else {
          alert(response.message || 'Failed to fetch  list.');
        }
      }
    );
  }

  paginate(): void {
    const startIndex = (this.pageAttributes.currentPage - 1) * this.pageAttributes.itemsPerPage;
    const endIndex = startIndex + this.pageAttributes.itemsPerPage;
    this.Employees = this.allEmployees.slice(startIndex, endIndex);
  }

  show_list_slip(obj_clicked: any) {
    this.employee = obj_clicked
    this.masterDataService.payslips('?Month=' + this.filters.selectedMonth.value + '&Year=' + this.filters.selectedYear.value + '&EmpId=' + obj_clicked.employeeId + '').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data.pendingRecords)) {
          this.payslips = response.data.pendingRecords;
        } else {
          alert(response.message || 'Failed to fetch Department list.');
        }
      },
      (error) => {
        console.error('Error fetching Department list:', error);
        alert('An error occurred while fetching the Department list.');
      }
    );
  }
  generate_payslip(obj_clicked: any) {
    let objec = { EmpId: obj_clicked.employeeId, employeeName: obj_clicked.employeeName }
    const payload ={
      EmpId: obj_clicked.employeeId,
      Month: this.filters.selectedMonth.value,
      Year: this.filters.selectedYear.value
    }
    this.masterDataService.generatePay(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          alert(response.message + ' for employee ' + objec.employeeName);
          this.router.navigate(['/payslip-records']);
        } else {
          alert(response.message + ' for employee ' + objec.employeeName);
        }
      },
      (error) => {
        console.error('Error fetching Department list:', error);
        alert('An error occurred while fetching the Department list.');
      }
    );
  }
}

