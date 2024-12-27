import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-payslip-not',
  templateUrl: './payslip-not.component.html',
  styleUrls: ['./payslip-not.component.css']
})
export class PayslipNotComponent {
  payId:any
  Department: any[] = []; 
  payslips:any[]=[]
  employee:any
    constructor(private masterDataService: MasterDataService,private route: ActivatedRoute,private router: Router) {}
    ngOnInit(): void {
      this.getDepartmentList(); 
      
    }
    getDepartmentList(): void {
      this.masterDataService.getpayslipList('?EffPeriod=Nov-2024').subscribe(
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
    show_list_slip(obj_clicked:any)
    {
      this.employee=obj_clicked
      this.masterDataService.payslips('?EffPeriod=Nov-2024&EmpId='+obj_clicked.employeeId+'').subscribe(
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
    generate_payslip(obj_clicked:any)
    {
      let objec={EmpId:obj_clicked.employeeId}
      let st="?EmpId="+obj_clicked.employeeId+""
      this.masterDataService.generatePay(st).subscribe(
        (response: any) => {
          console.log('API Response:', response);
          if (response.success) {
            alert(response.message);    
            this.router.navigate(['/payslip-records']);     
          } else {
            alert(response.message );
          }
        },
        (error) => {
          console.error('Error fetching Department list:', error);
          alert('An error occurred while fetching the Department list.');
        }
      );
    }
}

