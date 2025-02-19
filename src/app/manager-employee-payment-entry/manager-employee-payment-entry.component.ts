import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from 'src/app/data.Service';
import { Employee } from 'src/app/utils/interface/Employee';
import { Vendor } from 'src/app/utils/interface/vendor';
import { Category, City, Company, Department, Designation } from 'src/app/utils/interface/masters';
import { UserType } from 'src/app/common/user-type.enum';
import { Action, ModuleType } from 'src/app/common/action.enum';
import { ModuleTypeLabels } from 'src/app/common/labels';
import { BankDetails } from 'src/app/utils/interface/BankDetails';

@Component({
  selector: 'app-manager-employee-payment-entry',
  templateUrl: './manager-employee-payment-entry.component.html',
  styleUrls: ['./manager-employee-payment-entry.component.css']
})
export class ManagerEmployeePaymentEntryComponent {
  Action = Action;
  ModuleType = ModuleType;
  ModuleTypeLabels = ModuleTypeLabels;
  UserType = UserType;
  user: any;
  userAccessLevel: any;

  EmployeesData: any={
    employees:{},
    totalAmount:{}
  };

  pageAttributes = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
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
  constructor(
    private masterDataService: MasterDataService,
    private dataService: DataService
  ) {
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);
    });
  }

  ngOnInit(): void {

  }
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.pageAttributes.currentPage = 1;
    this.fetchEmployeePayList();
  }

  search() {
    this.fetchEmployeePayList();
  }

  fetchEmployeePayList(){
    const payload = this.dataService.getPayloadValue(this.filters);
    const fpayload ={
      ...payload,
      ...this.pageAttributes
    }
    this.masterDataService.getEmployeePayment(fpayload).subscribe(
      (response:any)=>{
        if(response.success){
          this.EmployeesData = {
            employees: response.data.employees, // Store employees array
            totalAmount: response.data.totalAmount // Store total amount
          };
          
          this.pageAttributes.totalPages = response.totalPages;
        }
      }
    );
  }

  
  toggleAmount(employee: any) {
    employee.isEditing = true;
    employee.oldAmount = employee.amount; // Store old value for cancel functionality
  }


  cancelEdit(employee: any) {
    employee.amount = employee.oldAmount; // Restore original value
    employee.isEditing = false;
  }



  updateAmount(employee: any) {
    const payload = [{
      employeeId: employee.employeeId,
      month: this.filters.selectedMonth.value,
      year: this.filters.selectedYear.value,     
      amount: employee.amount || 0,  
    }];
  
    this.masterDataService.updateEmployeePayment(payload).subscribe(
      (response: any) => {
        if (response.success) {
          this.dataService.showSnackBar("Employee payment updated successfully");
          this.fetchEmployeePayList();
        }
      }
    );
  }
  


}
