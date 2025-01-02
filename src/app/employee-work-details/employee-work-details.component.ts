import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { EmployeeWorkDetailsService } from './employee-work-details.service';
import { UserType } from '../common/user-type.enum';
import { myMonths, myYears } from '../utils/helpers/variables';

@Component({
  selector: 'app-employee-work-details',
  templateUrl: './employee-work-details.component.html',
  styleUrls: ['./employee-work-details.component.css']
})
export class EmployeeWorkDetailsComponent implements OnInit {

  UserType = UserType;
  userAccessLevel: any;
  user: any;
  
  odslip: any;
  Employee: any[] = [];
  Company: any[] = []; 
  

  states: any[] = [];
  cities: any[] = [];
  companies: any[] = [{ companyId: 1, companyFName: 'Default' }];


  selectedStateId: any = '';
  selectedCityId: any = '';
  selectedCompanyId: any = '';


  isModalOpen: boolean = false;
  isAttendanceModalOpen: boolean = false;

  employees: any[] = []; // List of employees to select from
  employeeWorkDetails: any = null; // To store the fetched work details

  // Selected month and year for the calendar
  selectedMonth: number = new Date().getMonth(); // Default to current month
  selectedYear: number = new Date().getFullYear(); // Default to current year

  selectedWorkDetail: any = {
  };

  months = myMonths;
  years = myYears;

  attendanceDetails: any[] = [
    
  ];

  
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
      key: 'companyId',
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
      show: true,
      key: 'employeeId',
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
    private dataService: DataService,
    private employeeWorkDetailsService: EmployeeWorkDetailsService
  ) {
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = new Date().getFullYear();
    this.dataService.asyncGetUser().then((user:any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);

      if (this.userAccessLevel === UserType.MANAGER) {
        this.selectedCompanyId = this.user.companyId;
        if (!this.selectedCompanyId) {
          this.dataService.showSnackBar('Company not found');
        }
      }
    });
  }


  ngOnInit(): void {
    this.fetchStates();

    this.getCompanyList();
      this.getEmployeeList();
    

    this.odslip={
      employeeId: 0,
      manager_Id: '3',
      visiting_Company_Id: '',
      purpose: '',
      from_Date: '',
      to_Date: '',
      how_Many_Days: '',
      insert_Manager_id: '2'
     
    }
  }


  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.fetchEmployeeWorkDetails();
  }

  search(){
    this.fetchEmployeeWorkDetails();
  }

  //#region  Fetch

  fetchStates() {
    this.masterDataService.getStates().subscribe((response) => {
      if (response.success) this.states = response.data;
    });
  }

  fetchCities() {
    const payload = { stateId: this.selectedStateId };
    this.masterDataService.getCity(payload).subscribe((response) => {
      if (response.success) this.cities = response.data;
    });
  }

  fetchCompanies() {
    const payload = { cityId: this.selectedCityId };
    this.masterDataService.getCompany(payload).subscribe((response) => {
      if (response.success) this.companies = response.data;
    });
  }


  fetchEmployeeWorkDetails(): void {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.employeeWorkDetailsService.getEmployeeWorkDetails(payload).subscribe((response) => {
      if (response.success) {
        this.employeeWorkDetails = response.data;
      }
    });
  }
  openUpdateModal(detail: any): void {
    this.selectedWorkDetail = detail;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedWorkDetail = {
    };
  }


  //#endregion



  //#region  OnChange

  onStateChange() {
    this.selectedCityId = '';
    this.selectedCompanyId = '';
    this.fetchCities();
  }

  onCityChange() {
    this.selectedCompanyId = '';
    this.fetchCompanies();
  }

  onCompanyChange() {
  }


  // Method to update the selected month and year and regenerate the date range
  onMonthYearChange(): void {
    this.fetchEmployeeWorkDetails();
  }

  // Update shifts on change
  onShiftChange(employee: any, date: string): void {
    console.log(`${employee.name}'s shift on ${date} changed to ${employee.shifts[date]}`);
  }


  //#endregion


  updateWorkDetails(): void {
    if (!this.selectedMonth || !this.selectedYear) {
      this.dataService.showSnackBar('Month and year are required');
      return;
    }

    const updatedData = {
      ...this.selectedWorkDetail,
      month: this.filters.selectedMonth.value,
      year: this.filters.selectedYear.value
    };

    this.employeeWorkDetailsService.updateEmployeeWorkDetails(updatedData).subscribe((response) => {
      if (response.success) {
        this.fetchEmployeeWorkDetails();
        this.closeModal();
      }
    });
  }

  openAttendanceDetail(detail: any): void {
    this.isAttendanceModalOpen = true;
    this.attendanceDetails =[];
    var payload = {
      month: this.selectedMonth,
      year: this.selectedYear,
      empId: detail.employeeId
    }
    this.employeeWorkDetailsService.getAttendanceDetails(payload).subscribe((response) => {
      if (response.success) {
        this.attendanceDetails = response.data;
      }
    })

  }

  saveodslip(odslip: any): void {
    console.log(odslip)
      // if (!this.employeeForm) {
      //   console.error('Form not initialized.');
      //   return;
      // }
    
      this.masterDataService.saveodslip(odslip).subscribe(
        (response: any) => {
          console.log('API Response:', response);
          if (response.success) {
            alert('odslip updated successfully.');            
          } else {
            alert(response.message || 'Failed to update odslip.');
          }
        },
        (error: any) => {
          console.error('Error updating odslip:', error);
          alert('An error occurred while updating the odslip.');
        }
      );
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

    getEmployeeList(): void {
      this.masterDataService.getEmployees().subscribe((response: any) => {
        if (response?.success && Array.isArray(response.data)) {
          this.Employee = response.data;
        } else {
          alert(response?.message || 'Failed to fetch Employee list.');
        }
      });
    }

}
