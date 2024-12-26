import { ChangeDetectorRef, Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MasterDataService } from '../services/master-data.service';
import { FullCalendarComponent } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, EventApi, EventClickArg, DateSelectArg } from '@fullcalendar/core';

@Component({
  selector: 'app-shift-management',
  templateUrl: './shift-management.component.html',
  styleUrls: ['./shift-management.component.css']
})
export class ShiftManagementComponent  {
  @ViewChild('calender') calendarComponent!: FullCalendarComponent;

  eventGuid = 0;
  calendarEvents = [
    { title: 'Morning Shift', start: '2024-12-25T09:00:00', end: '2024-12-25T17:00:00' },
    { title: 'Afternoon Shift', start: '2024-12-26T12:00:00', end: '2024-12-26T20:00:00' }
  ];

  selectedShift: string = '';
  isShiftSelectionOpen = false;
  selectedDate: string = '';

  calendarApi: any;
  states: any[] = [];
  cities: any[] = [];
  companies: any[] = [{ companyId: 1, companyFName: 'Default' }];
  employees = [
    { employeeId: 1, employeeName: 'John Doe', shift: 'Morning' },
    { employeeId: 2, employeeName: 'Jane Smith', shift: 'Afternoon' }
  ];

  selectedStateId: any = '';
  selectedCityId: any = '';
  selectedCompanyId: any = '';

  calendarPlugins = [dayGridPlugin, interactionPlugin];
  calendarHeader = { left: 'prev,next', center: 'title', right: 'today' };

  calendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
       left: 'prev,next today',
       center: 'title',
        right: 'dayGridMonth,listWeek' },
    initialView: 'dayGridMonth',
    initialEvents: this.calendarEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    displayEventTime: false,
    // eventTimeFormat: { // like '14:30:00'
    //   hour: '2-digit' as '2-digit' | 'numeric' | undefined,
    //   minute: '2-digit' as '2-digit' | 'numeric' | undefined,
    //   second: '2-digit' as '2-digit' | 'numeric' | undefined,
    //   hour12: false
    // }
  };

  isCalendarOpen = false;
  selectedEmployee: any = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private masterDataService: MasterDataService
  ) { }

  ngOnInit() {
    this.fetchStates();
  }


  ngAfterViewInit() {
    // The calendar will be available after view initialization
    this.calendarApi = this.calendarComponent.getApi();
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

  onStateChange() {
    this.selectedCityId = '';
    this.selectedCompanyId = '';
    this.fetchCities();
  }

  onCityChange() {
    this.selectedCompanyId = '';
    this.fetchCompanies();
  }

  onCompanyChange() { }

  openCalendar(employee: any) {
    this.selectedEmployee = employee;
    this.isCalendarOpen = true;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    // Convert selected start and end times to Date objects
    const selectedStart = new Date(selectInfo.startStr);
    const selectedEnd = new Date(selectInfo.endStr);
  
    // Open the shift selection modal and store the selected date
    this.isShiftSelectionOpen = true;
    this.selectedDate = selectedStart.toDateString();  // Display the selected date in a user-friendly format
    
    // Disable adding events automatically here (no event creation)
  
    // Optionally, you could set the default shift in the dropdown if needed
  }

  

  createEventId() {
    return String(this.eventGuid++);
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.cdr.detectChanges();
  }
 
  addEventFromButton() {
    if (!this.selectedShift || !this.selectedDate) {
      alert('Please select both a shift and a date!');
      return;
    }
  
    // Ensure the selectedDate is in the format 'YYYY-MM-DD' (without time zone shifting)
    const selectedDate = new Date(this.selectedDate);
    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
  
    // Parse the selectedDate and check if it's a valid date
    const startDate = new Date(`${formattedDate}T09:00:00`);
    const endDate = new Date(`${formattedDate}T17:00:00`);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Invalid date selected!');
      return;
    }
    // Remove the time part to compare only the date (set to midnight)
    const strippedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const strippedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
    // Check if an event already exists for the selected date (ignoring time)
    const existingEvent = this.calendarEvents.find(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
  
      // Remove time part for existing event
      const strippedEventStart = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const strippedEventEnd = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
  
      // Check if the event dates overlap (ignoring time)
      return (strippedStartDate <= strippedEventEnd && strippedEndDate >= strippedEventStart);
    });
  
    if (existingEvent) {
      alert('An event already exists for this date!');
      return; // Prevent event creation if there is a conflict
    }
  
    // Format the start and end time in ISO 8601 format
    const formattedStart = startDate.toISOString();
    const formattedEnd = endDate.toISOString();
  
    const newEvent = {
      id: this.createEventId(),
      title: this.selectedShift,
      start: formattedStart,
      end: formattedEnd,
      allDay: false,
    };
  
    // Add the new event to the calendar's internal event list
    this.calendarEvents.push(newEvent);
  
    if (this.calendarApi) {
      // Add the event to FullCalendar using the calendarApi
      this.calendarApi.addEvent(newEvent);
  
      // After adding, we can call refetchEvents to update the calendar view
      this.calendarApi.refetchEvents(); // This will reload the events and display the new one
    }
  
    this.isShiftSelectionOpen = false;
  }
  
  
  
    
  closeShiftSelection() {
    this.isShiftSelectionOpen = false;  // Close without adding event
  }

  

}
