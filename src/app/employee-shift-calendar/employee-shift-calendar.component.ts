import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MasterDataService } from '../services/master-data.service';
import { FormBuilder } from '@angular/forms';
import { ShiftService } from './shift.service';
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';
import { myMonths, myYears } from '../utils/helpers/variables';

@Component({
  selector: 'app-employee-shift-calendar',
  templateUrl: './employee-shift-calendar.component.html',
  styleUrls: ['./employee-shift-calendar.component.css']
})
export class EmployeeShiftCalendarComponent implements OnInit {

  UserType = UserType;
  userAccessLevel: any;
  user: any;

  states: any[] = [];
  cities: any[] = [];
  companies: any[] = [{ companyId: 1, companyFName: 'Default' }];


  selectedStateId: any = '';
  selectedCityId: any = '';
  selectedCompanyId: any = '';


  // List of employees
  employees: any[] = [];

 months = myMonths;
  years = myYears;


  // Shift types
  shifts: any[] = [];
  shiftTypes: string[] = [];
  shiftMap: any = {};

  // Selected month and year for the calendar
  selectedMonth: number; // Default to current month
  selectedYear: number; // Default to current year

  // Generated date range (26th of the selected month to the 25th of the next month)
  dateRange: string[] = [];
  currentPage: number = 0;
  daysPerPage: number = 7;  // Show 7 days per page

  // In your component
shiftColors:any = {
  "Weekly Off": "#F5A623", // Example color
  "Fixed Shift": "#50E3C2",
  "NoShift": "#D0021B",
  "Holiday": "#4A90E2",
  "General": "#B8E986",
  "Sample Calendar": "#9013FE",
  "Night Shift": "#F8E71C"
};


  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private dataService :DataService,

    private shiftService: ShiftService) { 
      this.selectedMonth = new Date().getMonth() + 1;
      this.selectedYear = new Date().getFullYear();
      this.dataService.asyncGetUser().then((user:any) => {
        this.user = user;
        this.userAccessLevel = user.role;
        console.log('User Access Level:', this.userAccessLevel);

        if(this.userAccessLevel === UserType.MANAGER){
          this.selectedCompanyId = this.user.companyId;
          if(!this.selectedCompanyId){
            this.dataService.showSnackBar('Company not found');
          }
          this.fetchEmployeeShifts();
        }
      });
    }


  ngOnInit() {
    this.fetchStates();
    this.fetchShifts();
    this.generateDateRange();
  }

  getShiftColor(shift: string): string {
    return this.shiftColors[shift] || '#FFFFFF'; // Default color if shift is not found
  }

  //#region  Fetch

  fetchShifts() {
    this.masterDataService.getShifts().subscribe((response) => {
      if (response.success) {
        this.shifts = response.data;
        // Create a map of shiftFName to shiftId for quick lookup
        this.shiftMap = this.shifts.reduce((acc: any, shift: any) => {
          acc[shift.shiftFName] = shift.shiftId;
          return acc;
        }, {});
        this.shiftTypes = this.shifts.map((shift: any) => shift.shiftFName);
      }
    });
  }
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

  filterEmployees() {
    const payload = { cityId: this.selectedCityId, companyId: this.selectedCompanyId };
    this.masterDataService.getEmployeeList(payload).subscribe((response) => {
      if (response.success) this.employees = response.data;
    });
  }

  fetchEmployeeShifts() {
    const payload = {
      cityId: this.selectedCityId,
      compId: this.selectedCompanyId,
      month: Number(this.selectedMonth),
      year: this.selectedYear
    };
    this.shiftService.getEmployeeShifts(payload).subscribe((response) => {
      if (response.success) this.employees = response.data;
    });
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
    this.fetchEmployeeShifts();
  }

  // Method to update the selected month and year and regenerate the date range
  onMonthYearChange(): void {
    this.generateDateRange();  // Recalculate the date range when month or year changes
    this.currentPage = 0;  // Reset the page to the first one

    this.fetchEmployeeShifts();
  }

  // Update shifts on change
  onShiftChange(employee: any, date: string): void {
    console.log(`${employee.name}'s shift on ${date} changed to ${employee.shifts[date]}`);
  }


  //#endregion

  //#region  Calender

  // Function to get the next month (wrap around from December to January)
  getNextMonth(month: any): number {
    // Ensure the parameter is a number
    const currentMonth = Number(month);

    // Check if the input is a valid month number (0-11)
    if (isNaN(currentMonth) || currentMonth < 0 || currentMonth > 11) {
      throw new Error('Invalid month number. Month should be between 0 and 11.');
    }

    // Return the next month, with wrap-around from December (11) to January (0)
    return (currentMonth + 1) % 12;
  }

  // Function to get the next year
  getNextYear(year: any, month: any): number {
    // Ensure the year is a number
    const currentYear = Number(year);

    // Check if the input is a valid year
    if (isNaN(currentYear)) {
      throw new Error('Invalid year. Year should be a number.');
    }

    // If the month is December (11), we need to increment the year
    if (Number(month) === 11) {
      return currentYear + 1;
    }

    // Otherwise, return the current year
    return currentYear;
  }


  generateDateRange(): void {
    // Ensure that the start date is the 26th of the selected month
    const startDate = new Date(this.selectedYear, (this.selectedMonth-1), 26+1);

    // Get the next month using the getNextMonth function
    const endMonth = this.getNextMonth(this.selectedMonth -1 );

    // Get the next year using the getNextYear function
    const endYear = this.getNextYear(this.selectedYear, this.selectedMonth-1);

    // Ensure that the end date is the 25th of the next month
    const endDate = new Date(endYear, endMonth, 25+1);

    // Initialize the dateRange array
    this.dateRange = [];
    let currentDate = startDate;

    // Loop to populate the date range from 26th to 25th
    while (currentDate <= endDate) {
      // Add the date in YYYY-MM-DD format to the dateRange
      this.dateRange.push(currentDate.toISOString().split('T')[0]);  // Only takes the date, not time
      // Increment the date by one day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Debugging: Log the generated date range to ensure correctness
    console.log(this.dateRange);
  }


  // Navigate to the previous page
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  // Navigate to the next page
  nextPage(): void {
    if (this.currentPage < Math.floor(this.dateRange.length / this.daysPerPage)) {
      this.currentPage++;
    }
  }

  // Get the current set of dates for the current page
  getCurrentDates(): string[] {
    const startIndex = this.currentPage * this.daysPerPage;
    const endIndex = startIndex + this.daysPerPage;

    // Return a slice of the dateRange array for the current page
    return this.dateRange.slice(startIndex, endIndex);
  }

  // Get total pages based on the number of dates and days per page
  get totalPages(): number {
    return Math.ceil(this.dateRange.length / this.daysPerPage);
  }

  //#endregion
  saveShifts() {
    // Create a deep copy of the payload to prevent modifying the original employees
    const payloadCopy = JSON.parse(JSON.stringify(this.employees));

    // Iterate through each employee in the deep copy
    payloadCopy.forEach((employee: any) => {
      for (const date in employee.shifts) {
        const shiftName = employee.shifts[date];

        // Replace the shift name with the shiftId from shiftMap
        const shiftId = this.shiftMap[shiftName];

        if (shiftId) {
          employee.shifts[date] = shiftId; // Update shift to shiftId
        } else {
          console.warn(`Shift name "${shiftName}" not found in shiftMap.`);
        }
      }
    });

    console.log(payloadCopy);
    this.shiftService.updateEmployeeShifts(payloadCopy).subscribe((response) => {
      if (response.success) {
       this.dataService.showSnackBar('Shifts updated successfully');
       this.fetchEmployeeShifts();
      } else {
        this.dataService.showSnackBar('Failed to update shifts');
      }
    }
    );

  }

}
