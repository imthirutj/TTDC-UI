import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-shift-calendar',
  templateUrl: './employee-shift-calendar.component.html',
  styleUrls: ['./employee-shift-calendar.component.css']
})
export class EmployeeShiftCalendarComponent implements OnInit {
  // List of employees
  employees: any[] = [
    { name: "John Doe", id: 1, shifts: {} },
    { name: "Jane Smith", id: 2, shifts: {} },
    { name: "Alice Johnson", id: 3, shifts: {} }
  ];

  
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

  // Shift types
  shiftTypes: string[] = ['Morning', 'Afternoon', 'Night'];

  // Selected month and year for the calendar
  selectedMonth: number = new Date().getMonth(); // Default to current month
  selectedYear: number = new Date().getFullYear(); // Default to current year

  // Generated date range (26th of the selected month to the 25th of the next month)
  dateRange: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.generateDateRange();
  }

  // Generate the date range from 26th of the selected month to the 25th of the next month
  generateDateRange(): void {
    const startDate = new Date(this.selectedYear, this.selectedMonth, 26);
    const endDate = new Date(this.selectedYear, this.selectedMonth + 1, 25);

    this.dateRange = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      this.dateRange.push(currentDate.toISOString().split('T')[0]); // Adding dates in YYYY-MM-DD format
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Method to update the selected month and year and regenerate the date range
  onMonthYearChange(): void {
    this.generateDateRange();
  }

  // Update shifts on change
  onShiftChange(employee: any, date: string): void {
    console.log(`${employee.name}'s shift on ${date} changed to ${employee.shifts[date]}`);
  }
}
