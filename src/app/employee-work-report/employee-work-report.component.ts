import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MasterDataService } from '../services/master-data.service';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';
import { myMonths, myYears } from '../utils/helpers/variables';
import { ShiftService } from '../employee-shift-calendar/shift.service';
import { EmployeeWorkReportService } from './employee-work-report.service';

@Component({
  selector: 'app-employee-work-report',
  templateUrl: './employee-work-report.component.html',
  styleUrls: ['./employee-work-report.component.css']
})
export class EmployeeWorkReportComponent {
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
  shiftColors: any = {
    "Weekly Off": "#F5A623", // Example color
    "Fixed Shift": "#50E3C2",
    "NoShift": "#D0021B",
    "Holiday": "#4A90E2",
    "General": "#B8E986",
    "Sample Calendar": "#9013FE",
    "Night Shift": "#F8E71C"
  };


  status: { key: string; value: string }[] = [
    { key: 'PRESENT', value: 'Present' },
    { key: 'ABSENT', value: 'Absent' },
    { key: 'HOLIDAY', value: 'Holiday' },
    { key: 'WEEKOFF', value: 'Weekly Off' },
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
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private dataService: DataService,
    private employeeWorkReportService: EmployeeWorkReportService,
    private shiftService: ShiftService) {
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = new Date().getFullYear();
    this.dataService.asyncGetUser().then((user: any) => {
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


  ngOnInit() {
    this.fetchStates();
    this.fetchShifts();
    this.generateDateRange();
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.fetchEmployeeStatus();
  }

  search(){
    this.fetchEmployeeStatus();
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

  fetchEmployeeStatus() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.employeeWorkReportService.getEmployeeWorkReoportDetails(payload).subscribe((response) => {
      if (response.success){
        this.employees = response.data;
        this.addMissingDates();
      } 
    });
  }

  addMissingDates() {
    this.employees.forEach((employee) => {
      if (!employee.dates) {
        employee.dates = {}; // Initialize dates if missing
      }
  
      var datesRange = this.dateRange;
      datesRange.forEach((date) => {
        if (!employee.dates[date]) {
          // Add default values for the missing date
          employee.dates[date] = {
            status: '', // Default status
            _status: '', // Optional description
            biometricData: [], // Default empty array
            leave: {
              leaveRequestID: null,
              requested: false,
              status: '-',
              reason: '-'
            },
            OD: {
              ODRequestID: null,
              requested: false,
              status: '-',
              reason: '-'
            }
          };
        }
      });
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
    this.fetchEmployeeStatus();
  }

  // Method to update the selected month and year and regenerate the date range
  onMonthYearChange(): void {
    this.generateDateRange();  // Recalculate the date range when month or year changes
    this.currentPage = 0;  // Reset the page to the first one

    this.fetchEmployeeStatus();
  }

  // Update shifts on change
  onShiftChange(employee: any, date: string): void {
    console.log(`${employee.name}'s shift on ${date} changed to ${employee.shifts[date]}`);
  }


  //#endregion

  //#region  Calender

   // Function to get the previous previous month
  getPreviousPreviousMonth(month: number): number {
    return month === 0 ? 10 : month === 1 ? 0 : month - 2;
  }

  // Function to get the next month
  getNextMonth(month: number): number {
    return month === 11 ? 0 : month + 1; // If December (11), return January (0)
  }

  // Function to get the next year when going to the next month
  getNextYear(year: number, month: number): number {
    return month === 11 ? year + 1 : year;
  }

  // Generate the date range from the 26th of the previous previous month to the 25th of the next month
  generateDateRange(): void {
    const year = this.filters.selectedYear.value;
    const month = this.getPreviousPreviousMonth(this.filters.selectedMonth.value);

    // Ensure that the start date is the 26th of the selected month
    const startDate = new Date(year, month, 26+1);  // month is now correctly adjusted

    // Get the next month and year for the end date
    const endMonth = this.getNextMonth(this.filters.selectedMonth.value);
    const endYear = this.getNextYear(year, this.filters.selectedMonth.value);

    // Ensure that the end date is the 25th of the next month
    const endDate = new Date(endYear, endMonth - 1, 25+1);  // Adjust month here as well for the end date

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
    console.log('Generated Date Range:', this.dateRange);
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
    this.generateDateRange();  // Recalculate the date range when month or year changes
    const startIndex = this.currentPage * this.daysPerPage;
    const endIndex = startIndex + this.daysPerPage;

    var dates = this.dateRange.slice(startIndex, endIndex);
    console.log('Current Dates:', dates);
    // Return a slice of the dateRange array for the current page
    return dates;
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

   // console.log(payloadCopy);
    this.shiftService.updateEmployeeShifts(payloadCopy).subscribe((response) => {
      if (response.success) {
        this.dataService.showSnackBar('Shifts updated successfully');
        this.fetchEmployeeStatus();
      } else {
        this.dataService.showSnackBar('Failed to update shifts');
      }
    }
    );

  }
}
