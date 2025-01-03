import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-payslip-records',
  templateUrl: './payslip-records.component.html',
  styleUrls: ['./payslip-records.component.css']
})
export class PayslipRecordsComponent {
  payId: any
  Department: any[] = [];
  payslips: any[] = []
  employee: any;

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
      key: 'compId',
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
     private route: ActivatedRoute,
     private dataService : DataService) { 
      
     }

    
    
  ngOnInit(): void {
   // this.getEmployeeList();

  }
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getEmployeeList();
  }

  search(){
    this.getEmployeeList();
  }


  getEmployeeList(): void {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getpayslipList(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data.pendingRecords)) {
          this.Department = response.data.paidRecords;

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
    this.masterDataService.payslips('?EffPeriod=Nov-2024&EmpId=' + obj_clicked.employeeId + '').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data.payslipRecords)) {
          this.payslips = response.data.payslipRecords;
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
}
