import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserType } from 'src/app/common/user-type.enum';
import { DataService } from 'src/app/data.Service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { EmployeePassbook } from 'src/app/utils/interface/EmployeePassbook';

@Component({
  selector: 'app-payslip-records',
  templateUrl: './payslip-records.component.html',
  styleUrls: ['./payslip-records.component.css']
})
export class PayslipRecordsComponent {
  payId: any
  EmpLists: any[] = [];
  payslips: any[] = []
  employee: any;

  user:any ={};
  userAccessLevel: any;
  UserType=UserType;

  passbookModal:any={
    show:false,
    title:'',
    data: new EmployeePassbook(),
    employeeId:'',
  };

  modalAttr: any = {
    show: false,
    title:'',
    maxWidth: '90vw',
  }

  formData = new FormData();

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
      includeInSearchParams:true
    },
  };
  
  constructor(private masterDataService: MasterDataService,
     private route: ActivatedRoute,
     public dataService : DataService) { 
      this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);
    });
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

    const fpayload = {
      ...payload,
      employeeCode: this.filters.employeeCode.value,
    }
    this.masterDataService.getpayslipList(fpayload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data.pendingRecords)) {
          this.EmpLists = response.data.paidRecords;

        } else {
          alert(response.message || 'Failed to fetch  list.');
        }
      }
    );
  }

  show_list_slip(obj_clicked: any) {
    this.modalAttr.show=true;
    this.modalAttr.title = 'Payslip Records';
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

  closePaySlip(){
    this.modalAttr.show = false;
    this.modalAttr.title = '';
  }


  getTotal(field: string): number {
    return this.EmpLists.reduce((sum, record) => sum + (record[field] || 0), 0);
  }

  passbookImage(event: any): void {
    const file = event.target.files[0]; // Allow only one file
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
  
    this.formData = new FormData();
    this.formData.append('file', file, file.name); // Ensure key is 'file' (matches .NET API)
  }
  

  openPassbookModal(obj: any) {
    this.passbookModal.show = true;
    this.passbookModal.employeeId = obj.employeeId;
    const selectedMonth = this.dataService.getMonthName(this.filters.selectedMonth.value);

    this.passbookModal.title = `View Passbook - ${selectedMonth} - ${this.filters.selectedYear.value}`;
    const payload ={
      employeeId: obj.employeeId,
      month: this.filters.selectedMonth.value,
      year: this.filters.selectedYear.value
    }
    this.masterDataService.getPassbooks(payload).subscribe(
      (response:any)=>{
        if(response.success){
          this.passbookModal.data = response.data;
        }
      }
    );
  }
  closePassbookModal(){
    this.passbookModal.show = false;
    this.passbookModal.data = new EmployeePassbook();
    this.passbookModal.employeeId ='';
  }

  uploadPassbook(){
    if(!this.formData){
      this.dataService.showSnackBar('Please select a file to upload.');
      return;
    }
    const payload = {
      employeeID: this.passbookModal.employeeId,
      month: this.filters.selectedMonth.value,
      year:this.filters.selectedYear.value
    };
    this.masterDataService.uploadPassbook(this.formData, payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.closePassbookModal();
        } 
      });
  }
  

}
