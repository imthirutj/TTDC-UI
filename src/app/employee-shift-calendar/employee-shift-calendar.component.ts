import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MasterDataService } from '../services/master-data.service';
import { FormBuilder } from '@angular/forms';
import { ShiftService } from './shift.service';
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';
import { myMonths, myYears } from '../utils/helpers/variables';
import { EmployeeShift } from '../utils/interface/EmployeeShift';

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
  employees: EmployeeShift[] = [];


  months = myMonths;
  years = myYears;


  // Shift types
  shifts: any[] = [];
  shiftTypes: string[] = [
    'WEEKOFF',
    // 'HOLIDAY', 
    'MORNING',
    'AFTERNOON',
    'NIGHT',
    'GENERAL',
    'BREAK'
  ];
  selectedStatus: string = ''; // Stores the selected status

  shiftMap: any = {};

  // Selected month and year for the calendar
  selectedMonth: number; // Default to current month
  selectedYear: number; // Default to current year

  // Generated date range (26th of the selected month to the 25th of the next month)
  dateRange: string[] = [];
  currentPage: number = 0;
  daysPerPage: number = 31;  // Show 7 days per page

  // In your component
  shiftColors: any = {

    "MORNING": "#D0021B",
    "AFTERNOON": "#4A90E2",
    "NIGHT": "#B8E986",
    "GENERAL": "#9013FE",
    "WEEKOFF": "#F5A623",
    "HOLIDAY": "#50E3C2",
  };

  //#region Filter
  filters: any = {
    selectedMonth: {
      value: this.getPreviousMonth(Number(new Date().getMonth()) + 1), // Default to current month
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
    employeeCode: {
      value: '',
      show: true,
      key: 'employeeCode',
      includeInSearchParams: true
    },
    employeeName: {
      value: '',
      show: true,
      key: 'employeeName',
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
    public dataService: DataService,

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
    // this.fetchShifts();
    this.generateDateRange();
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.fetchEmployeeShifts();
  }

  search() {
    this.fetchEmployeeShifts();
  }

  getShiftColor(shift: string): string {
    return this.shiftColors[shift] || '#FFFFFF'; // Default color if shift is not found
  }


  //#region  Fetch

  // fetchShifts() {
  //   this.masterDataService.getShifts().subscribe((response) => {
  //     if (response.success) {
  //       this.shifts = response.data;
  //       // Create a map of shiftFName to shiftId for quick lookup
  //       this.shiftMap = this.shifts.reduce((acc: any, shift: any) => {
  //         acc[shift.shiftFName] = shift.shiftId;
  //         return acc;
  //       }, {});
  //       this.shiftTypes = this.shifts.map((shift: any) => shift.shiftFName);
  //     }
  //   });
  // }
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
    if ((this.filters.role.value =='CITY_ADMIN' || this.filters.role.value =='STATE_ADMIN') &&
      this.filters.companyId.value == '') {
      this.dataService.showSnackBar('Please select Unit to view shifts');
      return;
    }
    this.employees = [];
    const payload = this.dataService.getPayloadValue(this.filters);
    this.shiftService.getEmployeeShifts(payload).subscribe((response) => {
      if (response.success) {
        this.employees = response.data as EmployeeShift[];
      };
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
    console.log(`${employee.name}'s shift on ${date} changed to ${employee.dates[date]}`);
  }


  //#endregion

  //#region  Calender

  getPreviousMonth(month: number): number {
    return month === 1 ? 12 : month - 1;
  }

  getPreviousPreviousMonth(month: number): number {
    return month === 1 ? 11 : month === 2 ? 12 : month - 2;
  }

  // Function to get the next month
  getNextMonth(month: number): number {
    return month === 12 ? 1 : month + 1; // If December (11), return January (0)
  }

  // Function to get the next year when going to the next month
  getNextYear(year: number, month: number): number {
    return month === 1 ? year - 1 : year;
  }


  generateDateRange(): void {
    const selectedYear = Number(this.filters.selectedYear.value);
    const selectedMonth = Number(this.filters.selectedMonth.value);

    // Calculate the previous month and adjust the year if needed
    let previousMonth = selectedMonth - 1;
    let previousYear = selectedYear;

    if (previousMonth < 1) {
      previousMonth = 12; // Set to December
      previousYear -= 1;  // Decrease the year
    }

    // Start date: 26th of the previous month
    const startDate = new Date(previousYear, previousMonth - 1, 26);

    // End date: 25th of the current month
    const endDate = new Date(selectedYear, selectedMonth - 1, 25);

    // Function to format date as 'YYYY-MM-DD'
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if month < 10
      const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if day < 10
      return `${year}-${month}-${day}`;
    };

    // Initialize the dateRange array
    this.dateRange = [];

    // Loop through each date between startDate and endDate
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      this.dateRange.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // Increment the date by 1
    }

    // console.log('Date Range:', this.dateRange);  // Output for debugging
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

    // Return a slice of the dateRange array for the current page
    return this.dateRange.slice(startIndex, endIndex);
  }

  // Get total pages based on the number of dates and days per page
  get totalPages(): number {
    return Math.ceil(this.dateRange.length / this.daysPerPage);
  }

  isAssign: boolean = false;
  headerSelection: { [key: string]: boolean } = {};

  onHeaderCheckboxChange(date: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked; // Typecast here
    this.headerSelection[date] = isChecked; // Update header selection state
    this.employees.forEach(employee => {
      if (employee.dates[date]) {
        employee.dates[date].selected = isChecked; // Update all rows based on header checkbox
        employee.dates[date].statusChanged = true;
      }
    });
  }

  applyStatus() {


    this.employees.forEach(employee => {
      Object.keys(employee.dates).forEach(date => {
        if (employee.dates[date]?.selected) {
          // Update the status for selected dates
          employee.dates[date].shift = this.selectedStatus;
          employee.dates[date].statusChanged = true; // Mark as changed
        }
      });
    });

    // Clear selection after applying status
    this.employees.forEach(employee => {
      Object.keys(employee.dates).forEach(date => {
        employee.dates[date].selected = false;
      });
    });

    this.headerSelection = {}; // Clear the header selection
    this.selectedStatus = ''; // Reset selected status
  }
  assignShift() {
    this.isAssign = true;
    console.log('Employee Shift', this.employees)
  }
  submitShift() {

  }
  cancelShift() {
    this.isAssign = false;

    // Reset header selection (uncheck all header checkboxes)
    for (let date in this.headerSelection) {
      this.headerSelection[date] = false;
    }

    // Reset row selections (uncheck all row checkboxes for all employees)
    this.employees.forEach(employee => {
      for (let date in employee.dates) {
        employee.dates[date].selected = false; // Deselect all rows
      }
    });

    // Optionally, fetch the employee status to refresh the data
    this.fetchEmployeeShifts();
  }
  //#endregion
  saveShifts() {
    // Create a deep copy of the payload to prevent modifying the original employees
    const payloadCopy = this.employees.map((employee: any) => {
      const shiftData: any = {
        name: employee.name,
        id: employee.id,
        shifts: {} // Initialize an empty object for shifts
      };

      // Iterate through each date and add shifts to the shifts object
      for (const date in employee.dates) {
        const shiftName = employee.dates[date].shift;
        if (shiftName && shiftName.trim() !== '') {
          shiftData.shifts[date] = shiftName; // Add date-shift pair to the shifts object
        }
      }

      return shiftData; // Return the transformed employee data
    });

    // Send the transformed payload to the backend
    this.shiftService.updateEmployeeShifts(payloadCopy).subscribe((response) => {
      if (response.success) {
        this.dataService.showSnackBar('Shifts updated successfully');
        this.fetchEmployeeShifts();
      } else {
        this.dataService.showSnackBar('Failed to update shifts');
      }
    });
  }


  onRowCheckboxChange(date: string, employee: EmployeeShift): void {
    const allSelected = this.employees.every(employee => employee.dates[date]?.selected);
    employee.dates[date].statusChanged = true;
    this.headerSelection[date] = allSelected;
  }

  private ensureDateInitialized(employee: EmployeeShift, date: string): void {
    if (!employee.dates[date]) {
      employee.dates[date] = { shift: '', selected: false, statusChanged: false }; // Default values
    }
  }

  // Call this method before accessing shift or selected for a date
  getShift(employee: EmployeeShift, date: string): string {
    this.ensureDateInitialized(employee, date); // Ensure date is initialized
    return employee.dates[date].shift || ''; // Default to empty string if no shift is assigned
  }

  getShiftSelected(employee: EmployeeShift, date: string): boolean {
    this.ensureDateInitialized(employee, date); // Ensure date is initialized
    return employee.dates[date].selected || false; // Default to false if no selection is made
  }

  setShift(employee: EmployeeShift, date: string, newShift: string): void {
    this.ensureDateInitialized(employee, date); // Ensure date is initialized
    employee.dates[date].shift = newShift;
  }

  setShiftSelected(employee: EmployeeShift, date: string, value: boolean): void {
    this.ensureDateInitialized(employee, date); // Ensure date is initialized
    employee.dates[date].selected = value;
  }

  isPastDate(date: string): boolean {
    const currentDate = new Date();
    const inputDate = new Date(date);

    // Reset time components to midnight (00:00:00) for an accurate date-only comparison
    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate < currentDate; // Now it only considers past dates
  }


}
