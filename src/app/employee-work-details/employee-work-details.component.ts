import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { EmployeeWorkDetailsService } from './employee-work-details.service';
import { UserType } from '../common/user-type.enum';

@Component({
  selector: 'app-employee-work-details',
  templateUrl: './employee-work-details.component.html',
  styleUrls: ['./employee-work-details.component.css']
})
export class EmployeeWorkDetailsComponent implements OnInit {

  UserType = UserType;
  userAccessLevel: any;
  user:any;
    
  states: any[] = [];
  cities: any[] = [];
  companies: any[] = [{ companyId: 1, companyFName: 'Default' }];


  selectedStateId: any = '';
  selectedCityId: any = '';
  selectedCompanyId: any = '';


  isModalOpen: boolean = false;

  employees:any[] = []; // List of employees to select from
  employeeWorkDetails: any = null; // To store the fetched work details

   // Selected month and year for the calendar
   selectedMonth: number = new Date().getMonth(); // Default to current month
   selectedYear: number = new Date().getFullYear(); // Default to current year

   selectedWorkDetail: any = {
  };

     // List of months for the dropdown
  months = [
    { name: 'January', index: 0 },
    { name: 'February', index: 1 },
    { name: 'March', index: 2 },
    { name: 'April', index: 3 },
    { name: 'May', index: 4 },
    { name: 'June', index: 5 },
    { name: 'July', index: 6 },
    { name: 'August', index: 7 },
    { name: 'September', index: 8 },
    { name: 'October', index: 9 },
    { name: 'November', index: 10 },
    { name: 'December', index: 11 }
  ];

  // List of years for the dropdown
  years = [2024, 2025, 2026]; // Adjust the years as needed

  constructor(private cdr: ChangeDetectorRef,

    private masterDataService: MasterDataService,
    private dataSerivce :DataService,
    private employeeWorkDetailsService  :EmployeeWorkDetailsService
) { 
  this.dataSerivce.getUser().subscribe((user) => {
    this.user = user;
    this.userAccessLevel = user.role;
    console.log('User Access Level:', this.userAccessLevel);

    if(this.userAccessLevel === UserType.MANAGER){
      this.selectedCompanyId = this.user.companyId;
      if(!this.selectedCompanyId){
        this.dataSerivce.showSnackBar('Company not found');
      }
      this.fetchEmployeeWorkDetails();
    }
  });
}


  ngOnInit(): void {
    this.fetchStates();


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
    const payload = {
      stateId: this.selectedStateId,
      cityId: this.selectedCityId,
      compId: this.selectedCompanyId,
      month: this.selectedMonth,
      year: this.selectedYear
    };

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
   
  }

  // Update shifts on change
  onShiftChange(employee: any, date: string): void {
    console.log(`${employee.name}'s shift on ${date} changed to ${employee.shifts[date]}`);
  }


  //#endregion
  updateWorkDetails(): void {
    if (!this.selectedMonth || !this.selectedYear) {
     this.dataSerivce.showSnackBar('Month and year are required');
      return;
    }

    const updatedData = {
      ...this.selectedWorkDetail,
      month: this.selectedMonth,
      year: this.selectedYear
    };

    this.employeeWorkDetailsService.updateEmployeeWorkDetails(updatedData).subscribe((response) => {
      if (response.success) {
        this.fetchEmployeeWorkDetails();
        this.closeModal();
      }
    });
  }

}
