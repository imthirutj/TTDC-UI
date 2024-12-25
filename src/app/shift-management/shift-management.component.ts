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
export class ShiftManagementComponent implements AfterViewInit {

  @ViewChild(FullCalendarComponent, { static: false }) calendarComponent: FullCalendarComponent | undefined;

  eventGuid = 0;
  calendarEvents = [
    { title: 'Morning Shift', start: '2024-12-25T09:00:00', end: '2024-12-25T17:00:00' },
    { title: 'Afternoon Shift', start: '2024-12-26T12:00:00', end: '2024-12-26T20:00:00' }
  ];

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
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' },
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calendarApi = this.calendarComponent?.getApi();
    }, 0); 
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
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: this.createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
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
}
