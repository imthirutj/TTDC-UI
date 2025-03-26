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
  pageAttributes = {
    currentPage: 1,
    totalPages: 1,
    pageSize:10
  }
  totalCount: number = 0;
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
    salaryRangeMin: {
      value: '',
      show: true,
      key: 'salaryRangeMin',
      includeInSearchParams:true
    },
    salaryRangeMax: {
      value: '',
      show: true,
      key: 'salaryRangeMax',
      includeInSearchParams:true
    },
    otherDeductionsMin: {
      value: '',
      show: true,
      key: 'otherDeductionsMin',
      includeInSearchParams:true
    },
    otherDeductionsMax: {
      value: '',
      show: true,
      key: 'otherDeductionsMax',
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
    this.pageAttributes.currentPage=1;
    this.getEmployeeList();
  }

  search(){
    this.getEmployeeList();
    this.pageAttributes.currentPage=1;
  }


  getEmployeeList(): void {
    const payload = this.dataService.getPayloadValue(this.filters);

    const fpayload = {
      ...payload,
      employeeCode: this.filters.employeeCode.value,
      ...this.pageAttributes
    }
    this.EmpLists =[];
    this.masterDataService.getpayslipList(fpayload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success ) {
          this.EmpLists = response.data.paidRecords;
          this.pageAttributes.totalPages = response.totalPages;
          this.totalCount = response.totalCount;
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
        if (response.success) {
          this.payslips = response.data.payslipRecords;
        }
      }
    );
  }

  closePaySlip(){
    this.modalAttr.show = false;
    this.modalAttr.title = '';
  }


  getTotal(obj: any, key: string): number {
    return obj.employees.reduce((sum:any, emp:any) => sum + (emp[key] || 0), 0);
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


  
  toggleOtherDeductions(d: any) {
    d.isEditing = true;
    d.oldOtherDeductions = d.otherDeductions; // Store old value for cancel functionality
  }
  cancelOtherDeductionsEdit(d: any) {
    d.otherDeductions = d.oldOtherDeductions; // Restore original value
    d.isEditing = false;
  }

  updateOtherDeductions(employee: any) {
    var payload = {
      PayslipRecordId: employee.payslipRecordId,
      OtherDeductions: employee.otherDeductions
    };
    this.masterDataService.updateOtherDeductions(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Other Deductionsupdated successfully.');
          this.getEmployeeList();
        }
      }
    );
  }

  deletePayslipConfirm(){
    this.dataService.openConfirmationDialog2({
      title: ``,
      message: `Are you sure Want to Delete Payslip For All Employees?`,
      onYes: () => {
          this.deletePayslip();
      }
    });
  }

  deletePayslip(){
    
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.deletePayslip(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar(response.message);
          this.getEmployeeList();
        }
      }
    )
  }
}
