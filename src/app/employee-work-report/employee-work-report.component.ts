import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MasterDataService } from '../services/master-data.service';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';
import { myMonths, myYears } from '../utils/helpers/variables';
import { ShiftService } from '../employee-shift-calendar/shift.service';
import { EmployeeWorkReportService } from './employee-work-report.service';
import { DateDetails, EmployeeStatus } from '../utils/interface/EmployeeStatus';
import { CompensateRequest } from '../utils/interface/CompensateRequest';

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
  employees: EmployeeStatus[] = [];

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



  status: { key: string; value: string, color: string }[] = [
    { key: 'PRESENT', value: 'Present', color: 'rgb(63 107 51)' },
    { key: 'ABSENT', value: 'Absent', color: 'rgb(203 72 72)' },
    { key: 'ABSENT-LWT', value: 'Absent', color: 'rgb(203 72 72)' },//LWT-Less Working Hours
    { key: 'HOLIDAY', value: 'Holiday', color: 'rgb(97 114 219)' },
    { key: 'HOLIDAY-PRESENT', value: 'Holiday Present', color: 'rgb(97 114 219)' },
    { key: 'WEEKOFF-PRESENT', value: 'Holiday Present', color: 'rgb(97 114 219)' },
    { key: 'WEEKOFF', value: 'Weekly Off', color: 'rgb(121 4 81)' },
    { key: 'LEAVE', value: 'Leave', color: 'rgb(63 133 143)' },
    { key: 'OD', value: 'ODf', color: 'rgb(63 133 143)' },
  ];

  shiftStatus: { key: string; value: string, color: string }[] = [
    { key: 'MORNING', value: 'Morning', color: 'rgb(50 173 241)' },
    { key: 'AFTERNOON', value: 'Afternoon', color: 'rgb(165 56 46)' },
    { key: 'NIGHT', value: 'Night', color: 'rgb(50 46 85)' },
    { key: 'GENERAL', value: 'General', color: 'rgb(135 109 55)' },
    { key: 'UNKNOWN', value: 'Unknown', color: 'rgb(107 101 89)' },
  ];

  otherStatus: { key: string; value: string, color: string }[] = [
    { key: 'LEAVE', value: 'Leave', color: '#a9f7a9' },
    { key: 'OD', value: 'OD', color: '#ffa2a2' },
  ];

  reqStatus: { [key: string]: string } = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected'
  };

  modalAttr: any = {
    show: false,
    title: '',
    employeeDateDetails: new DateDetails(),
    employeeStatus: new EmployeeStatus(),
    hasSalaryGenerated: false
  }

  modalAttrEmployeeReport: any = {
    show: false,
    title: '',
    employeeStatus: new EmployeeStatus()
  }

  modalAttrAdjust: any = {
    show: false,
    title: '',
    maxWidth: '1200px',
    employeeStatus: new EmployeeStatus()
  }

  pageAttributes = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  }

  headerSelection: { [key: string]: boolean } = {};

  compensateDates: string[] = [];
  absentWeekOffHolidayData: DateDetails[] = [];
  leaveRequestedDays: DateDetails[] = [];
  odRequestedDays: DateDetails[] = [];
  compensatedRequestedDays: DateDetails[] = [];

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


  //#endRegion

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

  search() {
    this.fetchEmployeeStatus();
  }

  getStatusColor(status: string): string {
    // Find the status object by key and return its color
    const statusObj = this.status.find(s => s.key === status);
    return statusObj ? statusObj.color : '#FFFFFF'; // Default color if status not found
  }


  getShiftColor(status: string): string {
    // Find the status object by key and return its color
    const statusObj = this.shiftStatus.find(s => s.key === status);
    return statusObj ? statusObj.color : 'rgb(161 87 87)'; // Default color if status not found
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
    const fpayload = {
      pageNumber: this.pageAttributes.currentPage,
      pageSize: this.pageAttributes.pageSize,
      ...payload
    }
    this.employeeWorkReportService.getEmployeeWorkReportDetails(fpayload).subscribe((response) => {
      if (response.success) {
        this.employees = response.data as EmployeeStatus[];
        this.pageAttributes.totalPages = response.totalPages;
        // this.addMissingDates();
        // Iterate over each employee to call GetBiometricLogs API for each date
        // this.employees.forEach(employee => {
        //   this.addBiometricDataToEmployee(employee);
        // });
      }
    });
  }


  addBiometricDataToEmployee(employee: EmployeeStatus) {
    const empCode = employee.empCode;
    const dates = Object.keys(employee.dates).map(date => new Date(date));
    const minDate = new Date(Math.min(...dates.map(date => date.getTime())));
    const maxDate = new Date(Math.max(...dates.map(date => date.getTime())));

    let currentStartDate = new Date(minDate);
    const requests = []; // Collect requests to batch

    while (currentStartDate <= maxDate) {
      const currentEndDate = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth() + 1, 0);
      if (currentEndDate > maxDate) currentEndDate.setTime(maxDate.getTime());

      const startDate = this.dataService.formatDateWithoutTimezone(currentStartDate);
      const endDate = this.dataService.formatDateWithoutTimezone(currentEndDate);

      const payload = { empCode, startDate, endDate };

      // Push the request into the batch
      requests.push(() => this.makeBiometricCall(employee, payload));

      currentStartDate.setMonth(currentStartDate.getMonth() + 1);
      currentStartDate.setDate(1); // Move to the 1st of the next month
    }

    // Execute the requests in small batches
    this.dataService.executeBatches(requests, 3, 250); // Batch size: 3, Delay: 500ms
  }

  makeBiometricCall(employee: EmployeeStatus, payload: any) {
    return new Promise<void>((resolve) => {
      this.employeeWorkReportService.getBiometricLogs(payload).subscribe((biometricResponse) => {
        if (biometricResponse.success) {
          const biometricData = biometricResponse.data;
          Object.keys(biometricData).forEach(logDate => {
            if (employee.dates[logDate]) {
              employee.dates[logDate].biometricData = biometricData[logDate].biometricData;
            }
            else {
              // Optionally, log or handle missing dates
              console.warn(`Date entry for ${logDate} is missing in employee data.`);
            }
          });
        }
        resolve();
      });
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
          employee.dates[date] = new DateDetails();
        }
      });
    });
  }

  // This function filters the status options based on the date
  getAllStatusOptions(date: string): { key: string; value: string }[] {
    const currentDate = new Date();
    const targetDate = new Date(date);

    // Check if the date is current or in the past (previous date)
    // if (targetDate <= currentDate) {
    //   // For current or past dates,
    //   return this.status;
    // }
    // For future dates, return only Holiday and Weekly Off
    return this.status.filter(st => st.key === '' || st.key === '');
  }


  // This function filters the status options based on the date
  getStatusOptions(date: string): { key: string; value: string }[] {
    const currentDate = new Date();
    const targetDate = new Date(date);

    // Check if the date is current or in the past (previous date)
    if (targetDate <= currentDate) {
      // For current or past dates,
      return this.status;
    }
    // For future dates, return only Holiday and Weekly Off
    return this.status.filter(st => st.key === 'HOLIDAY' || st.key === 'WEEKOFF');
  }

  isStatus(statusKey: string): boolean {
    return this.status.some(os => os.key === statusKey);
  }

  isOtherStatus(statusKey: string): boolean {
    return this.otherStatus.some(os => os.key === statusKey);
  }

  getOtherStatusValue(statusKey: string): string {
    const status = this.otherStatus.find(os => os.key === statusKey);
    return status ? status.value : '';
  }


  getAvailableCompensatedDates(employeeId: any) {
    var payload = {
      employeeId: employeeId
    }
    this.compensateDates = [];
    this.employeeWorkReportService.getAvailableCompensatedDates(payload).subscribe((response) => {
      if (response.success) {
        this.compensateDates = response.data;
      }
    })
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


  onStatusChange(employee: EmployeeStatus, date: string, event: Event) {
    const target = event.target as HTMLSelectElement;
    const newStatus = target?.value;

    if (!newStatus) {
      console.warn(`No status selected for date: ${date}`);
      return;
    }

    const dateDetails = employee.dates[date];

    if (dateDetails) {
      if (dateDetails.status) {
        dateDetails.status = newStatus;
        dateDetails.statusChanged = true; // Mark as changed
      }
    } else {
      console.warn(`Date details for ${date} are missing or null.`);
    }

    console.log('Employee:', employee);
  }


  //#endregion

  //#region  Calender

  // Function to get the previous previous month

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

    var dates = this.dateRange.slice(startIndex, endIndex);
    //console.log('Current Dates:', dates);
    // Return a slice of the dateRange array for the current page
    return dates;
  }

  // Get total pages based on the number of dates and days per page
  get totalPages(): number {
    return Math.ceil(this.dateRange.length / this.daysPerPage);
  }

  //#endregion

  openModal(employeeDates: DateDetails, employee: EmployeeStatus) {
    this.modalAttr.show = true;
    this.modalAttr.employeeDateDetails = employeeDates;
    this.modalAttr.title = 'Employee Work Report';
    this.modalAttr.hasSalaryGenerated = employee.hasSalaryGenerated;
  }

  closeModal() {
    this.modalAttr.show = false;
    this.modalAttr.employeeDateDetails = new DateDetails();
    this.modalAttr.hasSalaryGenerated = false;
  }

  openEmployeeReportModal(employee: EmployeeStatus) {
    this.modalAttrEmployeeReport.show = true;
    this.modalAttrEmployeeReport.employeeStatus = employee;
    this.modalAttrEmployeeReport.title = `${employee.employeeName}'s Work Report`;
  }

  closeEmployeeReportModal() {
    this.modalAttrEmployeeReport.show = false;
    this.modalAttrEmployeeReport.employeeStatus = new EmployeeStatus(); // Reset the employeeDateDetails objec
  }

  //#region  Update


  cancel() {
    this.isAssignWeekOff = false;

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
    this.fetchEmployeeStatus();
  }

  submit() {
    // Flatten the payload and include only changed statuses
    const payload = this.employees.flatMap(employee =>
      Object.keys(employee.dates)
        .filter(date => employee.dates[date].selected) // Only include changed statuses
        .map(date => ({
          employeeId: employee.empId,           // Map employee ID
          date: date,                           // Map date
          status: 'WEEKOFF'   // Map updated status
        }))
    );

    if (payload.length > 0) {
      // Create requests (promises) for each status change in chunks of 100
      const chunkSize = 100;
      const chunkedRequests = [];

      // Split the payload into chunks of 100
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize);
        const request = () => this.employeeWorkReportService.updateAttendance(chunk).toPromise();
        chunkedRequests.push(request);
      }

      // Execute the batches in parallel
      const batchSize = 100; // Batch size
      const delay = 200; // Delay in ms between batches

      const batchPromises = chunkedRequests.map((request, index) => {
        return new Promise<void>((resolve, reject) => {
          // Wait for the delay before each batch execution
          setTimeout(() => {
            request().then(() => {
              resolve();
            }).catch(error => {
              reject(error);
            });
          }, index * delay); // Delay before each batch
        });
      });

      // Wait for all batches to finish
      Promise.all(batchPromises)
        .then(() => {
          // Once all batches are done, fetch employee status
          this.dataService.showSnackBar("Attendance updated successfully");
          this.fetchEmployeeStatus(); // Refresh the data
        })
        .catch(error => {
          // Handle errors here
          console.error("Error updating attendance", error);
        });
    } else {
      this.dataService.showSnackBar("No changes detected in Attendance");
    }
  }




  //#endregion
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


  onRowCheckboxChange(date: string, employee: EmployeeStatus): void {
    const allSelected = this.employees.every(employee => employee.dates[date]?.selected);
    employee.dates[date].statusChanged = true;
    this.headerSelection[date] = allSelected;
  }

  selectedStatus: string = ''; // Stores the selected status


  applyStatus(): void {


    this.employees.forEach(employee => {
      Object.keys(employee.dates).forEach(date => {
        if (employee.dates[date]?.selected) {
          // Update the status for selected dates
          employee.dates[date].status = this.selectedStatus;
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


  reset() {
    this.headerSelection = {}; // Clear the header selection
    this.selectedStatus = ''; // Reset selected status
    this.fetchEmployeeStatus();
  }



  openAdjustModal(employee: EmployeeStatus) {
    this.modalAttrAdjust.show = true;
    this.modalAttrAdjust.employeeStatus = employee;
    this.modalAttrAdjust.title = `Manage ${employee.employeeName}'s Status`;
    this.updateEmployeeAdjust();
  }

  updateEmployeeAdjust() {
    this.absentWeekOffHolidayData = [];
    this.leaveRequestedDays = [];
    this.odRequestedDays = [];
    this.compensatedRequestedDays=[];

    const employee = this.modalAttrAdjust.employeeStatus as EmployeeStatus; // Ensure correct type
    this.getAvailableCompensatedDates(employee.empId);
    Object.entries(employee.dates).forEach(([date, details]) => {
      const record = details as DateDetails; // Use your defined class
      if (['ABSENT', 'ABSENT-LWT', 'HOLIDAY', 'WEEKOFF'].includes(record.status)
        || record.hasOverwrited == 1) {
        this.absentWeekOffHolidayData.push({ ...record, newStatus: '', date: date, isCompensated: record.isCompensated == '1' ? 'YES' : 'NO' });
      }

      if (record.leaveRequested == 1) {
        this.leaveRequestedDays.push({ ...record, newStatus: '', date: date });
      }
      if (record.odRequested == 1) {
        this.odRequestedDays.push({ ...record, newStatus: '', date: date });
      }
      if (record.compensateRequested == 1) {
        this.compensatedRequestedDays.push({ ...record, newStatus: '', date: date });
      }

    });

    console.log('Holiday/WeekOff/Absent Data:', this.absentWeekOffHolidayData);
  }

  updateCompensateRequest(obj: any, compensatedStatusId: number) {
   var CompensateRequest = {
    employeeId: obj.employeeId,
    date: obj.date,
    compensatedStatusId: compensatedStatusId,
    compensateManagerRemarks: obj.compensateManagerRemarks
   }

   this.masterDataService.updateCompensationRequest(CompensateRequest).subscribe(
    response => {
      console.log('API Response:', response);
      if (response.success) {
        this.dataService.showSnackBar('CompensateRequest updated successfully');
        this.search();
        this.closeAdjustModal();
      }
    }
   )

  }



  closeAdjustModal() {
    this.modalAttrAdjust.show = false;
    this.modalAttrAdjust.employeeStatus = new EmployeeStatus(); // Reset the employeeDateDetails objec
  }

  submitAdjust() {
    // Filter the data to only include entries where newStatus is not 'None'
    const filteredData = this.absentWeekOffHolidayData.filter(entry => entry.newStatus !== '');

    // Validate: Ensure compensatedDate is provided if isCompensated is 'YES'
    for (const entry of filteredData) {
      if (entry.isCompensated === 'YES' && !entry.compensatedDate) {
        this.dataService.showSnackBar('Compensate date is required when compensation is marked as "YES".');
        return; // Stop the submission if validation fails
      }
    }

    // Create the payload for the API
    const payload = filteredData.map(entry => ({
      employeeId: entry.employeeId,
      status: entry.newStatus,
      date: entry.date,
      isCompensated: entry.isCompensated === 'YES' ? 1 : 0,
      compensatedDate: entry.isCompensated === 'YES' ? entry.compensatedDate : null,
      remarks: entry.remarks
    }));

    // Call  API here to submit the data
    this.employeeWorkReportService.updateAttendance(payload).subscribe(
      response => {
        if (response.success) {
          this.dataService.showSnackBar('Attendance updated successfully.');
          this.closeAdjustModal();
          this.fetchEmployeeStatus();
        }
      }
    )
  }


  isAdjustable(employee: EmployeeStatus): boolean {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;  // getMonth() is 0-based, so we add 1
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();

    // Check if the selected date is in the past and if current day is after the 25th
    var val = (currentYear > this.filters.selectedYear.value ||
      (currentYear === this.filters.selectedYear.value && currentMonth > this.filters.selectedMonth.value) ||
      (currentYear === this.filters.selectedYear.value && currentMonth === this.filters.selectedMonth.value && currentDay > 25));


   // return val;
    return true;
  }

  isAssignWeekOff: boolean = false;

  assignWeekoff() {
    this.isAssignWeekOff = true;
  }


  // Variables to keep track of sort state
  sortBy: string = 'date';  // Default sorting by 'date'
  sortOrder: string = 'asc'; // Default ascending order
  // Sort the data based on column name and order
  sortData(column: string): void {
    // Toggle sorting order if the same column is clicked
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc'; // Reset to ascending when changing column
    }

    // Perform sorting based on the selected column and order
    this.absentWeekOffHolidayData.sort((a:any, b:any) => {
      let valueA = a[column];
      let valueB = b[column];

      // Handle case for dates (sort Date objects)
      if (column === 'date') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) {
        return this.sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

}
