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
  Department: any[] = [];
  payslips: any[] = []
  employee: any;
  month_name:any=['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  filters: any = {
    selectedMonth: {
      value: Number(new Date().getMonth()) + 1, // Default to current month
      show: true,
      key: 'month',
      includeInSearchParams:true
    },
    selectedYear: {
      value: new Date().getFullYear(), // Default to current year
      show: true,
      key: 'year',
      includeInSearchParams:true
    },
    cityId: {
      value: '',
      show: true,
      key: 'cityId',
      includeInSearchParams:true
    },
    companyId: {
      value: '',
      show: true,
      key: 'companyId',
      includeInSearchParams:true
    },
    designationId: {
      value: '',
      show: true,
      key: 'designationId',
      includeInSearchParams:true
    },
    deptId: {
      value: '',
      show: true,
      key: 'deptId',
      includeInSearchParams:true
    },
    catId: {
      value: '',
      show: true,
      key: 'catId',
      includeInSearchParams:true
    },
    employeeId: {
      value: '',
      show: true,
      key: 'employeeId',
      includeInSearchParams:true
    },
    vendorId: {
      value: '',
      show: true,
      key: 'vendorId',
      includeInSearchParams:true
    },
  };

  constructor(private masterDataService: MasterDataService, 
    private route: ActivatedRoute, private router: Router,
    private dataService : DataService
  ) { }
  ngOnInit(): void {
    //this.getEmployeeList();

  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getEmployeeList();
  }

  search(){
    this.getEmployeeList();
  }
 loop_id:number=0
  submit_vendor_wise()
  {

    this.loop_id=0
    for(let i=0;i<this.Department.length;i++)
    {
      this.loop_id=i;
    let st = '?EmpId=' + this.Department[i].employeeId + '&Month='+this.filters.selectedMonth.Value+'&Year='+this.filters.selectedYear.Value+''
    this.masterDataService.generatePay(st).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          alert(response.message+' for employee "'+this.Department[this.loop_id].employeeName+'"');
          if(this.loop_id==this.Department.length){
            this.router.navigate(['/payslip-records']);
          }
        } else {
          alert(response.message+' for employee '+this.Department[this.loop_id].employeeName);
        }
      },
      (error) => {
        console.error('Error fetching Department list:', error);
        alert('An error occurred while fetching the Department list.');
      }
    );
    }
  }

  
  getEmployeeList(): void {
    const payload = this.dataService.getPayloadValue(this.filters);
    console.log(this.filters)
    this.masterDataService.getpayslipList(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data.pendingRecords)) {
          this.Department = response.data.pendingRecords;

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
  show_list_slip(obj_clicked: any) {
    this.employee = obj_clicked
    this.masterDataService.payslips('?Month='+this.filters.selectedMonth.Value+'&Year='+this.filters.selectedYear.Value+'&EmpId=' + obj_clicked.employeeId + '').subscribe(
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
    let objec = { EmpId: obj_clicked.employeeId ,employeeName:obj_clicked.employeeName}
    let st = '?EmpId=' + obj_clicked.employeeId + '&Month='+this.filters.selectedMonth.Value+'&Year='+this.filters.selectedYear.Value+''
    this.masterDataService.generatePay(st).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          alert(response.message+' for employee '+objec.employeeName);
          this.router.navigate(['/payslip-records']);
        } else {
          alert(response.message+' for employee '+objec.employeeName);
        }
      },
      (error) => {
        console.error('Error fetching Department list:', error);
        alert('An error occurred while fetching the Department list.');
      }
    );
  }
}

