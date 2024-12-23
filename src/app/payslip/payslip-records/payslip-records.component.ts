import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-payslip-records',
  templateUrl: './payslip-records.component.html',
  styleUrls: ['./payslip-records.component.css']
})
export class PayslipRecordsComponent {
  payId:any
  Department: any[] = []; 
  payslips:any[]=[]
  employee:any
    constructor(private masterDataService: MasterDataService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.getDepartmentList(); 
      
    }
    getDepartmentList(): void {
      this.masterDataService.getpayslipList('?EffPeriod=Nov-2024').subscribe(
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
    show_list_slip(obj_clicked:any)
    {
      this.employee=obj_clicked
      this.masterDataService.payslips('?EffPeriod=Nov-2024&EmpId='+obj_clicked.employeeId+'').subscribe(
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
