import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  Employee: any[] = [];
  Designation: any[] = []; 
  Company: any[] = []; 
  Department: any[] = [];
  Category: any[] = [];
  States: any[] = [];
  City: any[] = [];
  employee: any;

  employeeForm!: FormGroup;

  constructor(private masterDataService: MasterDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getEmployeeList();
    this.getDesignationList();
    this.getCompanyList();
    this.getDepartmentList();
    this.getCategoryList();
    this.getStateList();
    this.getcityList();
   

    this.employeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      EmployeeCode: ['', Validators.required],
      NumericCode: ['', Validators.required],
      StringCode: ['', Validators.required],
      Gender: [''],
      designationId: [''],
      companyId: [''],
      departmentId: [''],
      categoryId: [''],
      stateId: [''],
      cityId: ['']
    });

    this.employee={
      employeeId: 0,
      employeeName: '',
      EmployeeCode: '',
      NumericCode: '',
      StringCode: '',
      Gender: '',
      AadhaarNumber: '',
      Qualifications: '',
      designationId: '',
      companyId: '',
      departmentId: '',
      categoryId: '',
      stateId: '',
      cityId: '' ,
      LoginName:'qwerty',
      LoginPassword:'12345'
    }
    
  }
  
  getEmployeeList(): void {
    this.masterDataService.getEmployeeList('').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Employee = response.data; 
          
        } else {
          alert(response.message || 'Failed to fetch Employee list.');
        }
      },
      (error) => {
        console.error('Error fetching Employee list:', error);
        alert('An error occurred while fetching the Employee list.');
      }
    );
  }
  getDesignationList(): void {
    this.masterDataService.getDesignation().subscribe((response: any) => {
      if (response?.success && Array.isArray(response.data)) {
        this.Designation = response.data;
      } else {
        alert(response?.message || 'Failed to fetch Designation list.');
      }
    });
  }

  getCompanyList(): void {
    this.masterDataService.getCompanylist().subscribe((response: any) => {
      if (response?.success && Array.isArray(response.data)) {
        this.Company = response.data;
      } else {
        alert(response?.message || 'Failed to fetch Company list.');
      }
    });
  }

  getDepartmentList(): void {
    this.masterDataService.getDepartment().subscribe((response: any) => {
      if (response?.success && Array.isArray(response.data)) {
        this.Department = response.data;
      } else {
        alert(response?.message || 'Failed to fetch Department list.');
      }
    });
  }

  getCategoryList(): void {
    this.masterDataService.getCategory().subscribe((response: any) => {
      if (response?.success && Array.isArray(response.data)) {
        this.Category = response.data;
      } else {
        alert(response?.message || 'Failed to fetch Category list.');
      }
    });
  }

  getStateList(): void {
    this.masterDataService.getStates().subscribe((response: any) => {
      if (response?.success && Array.isArray(response.data)) {
        this.States = response.data;
      } else {
        alert(response?.message || 'Failed to fetch States list.');
      }
    });
  }

  getcityList(): void {
    this.masterDataService.getcitylist().subscribe((response: any) => {
      if (response?.success && Array.isArray(response.data)) {
        this.City = response.data;
      } else {
        alert(response?.message || 'Failed to fetch City list.');
      }
    });
  }
  
  
  saveEmployee(employee: any): void {
  console.log(employee)
    if (!this.employeeForm) {
      console.error('Form not initialized.');
      return;
    }
  
    this.masterDataService.saveEmployee(employee).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          alert('Employee updated successfully.');
          this.getEmployeeList(); // Refresh the list
        } else {
          alert(response.message || 'Failed to update Employee.');
        }
      },
      (error: any) => {
        console.error('Error updating Employee:', error);
        alert('An error occurred while updating the Employee.');
      }
    );
  }

  
  
}
  

