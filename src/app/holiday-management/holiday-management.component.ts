import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from '../data.Service';
import { Action, ModuleType } from '../common/action.enum';
import { Company } from '../utils/interface/Company';
import { HolidayManagementServiceService } from './holiday-management-service.service';
import { Holiday } from '../utils/interface/Holiday';

@Component({
  selector: 'app-holiday-management',
  templateUrl: './holiday-management.component.html',
  styleUrls: ['./holiday-management.component.css']
})
export class HolidayManagementComponent {
  Action = Action;
  ModuleType = ModuleType;
  Holidays: Holiday[] = [];

  cities:any[]=[];
  modal = {
    action: Action.NONE,
    module: ModuleType.NONE,
    show: false,
    isEdit: false,
    title: '',
    holiday: new Holiday(),  // Use the Employee class here
  };


  filters: any = {
    selectedYear: {
      value: new Date().getFullYear(), // Default to current year
      show: true,
      key: 'year',
      includeInSearchParams: true
    },
  };
  constructor(private masterDataService: MasterDataService,
    private dataservice: DataService,
    private holidayManagementServiceService: HolidayManagementServiceService
  ) { }

  ngOnInit(): void {
    this.getHolidaysList();

  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getHolidaysList();
  }

  search() {
    this.getHolidaysList();
  }

  getHolidaysList(): void {
    const payload = this.dataservice.getPayloadValue(this.filters);
    this.holidayManagementServiceService.getHolidays(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Holidays = response.data;
          console.log('Company list:', this.Holidays);
        }
      }
    );
  }

  deleteHoliday(holidayId:number){
    this.holidayManagementServiceService.deleteHoliday(holidayId).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.getHolidaysList();
        }
      }
    );
  }

  openModal(action: Action, holiday?: Holiday): void {
    this.modal.show = true;
    this.modal.action = action;
    this.modal.module = ModuleType.EMPLOYEE;
    this.modal.title = action == Action.UPDATE ? 'Edit Holiday' : action == Action.CREATE ? 'Add Company' : 'View Employee';
    if (action == Action.UPDATE || action == Action.VIEW) {
      if (holiday) {
        this.modal.holiday = { ...holiday };
      }
      else{
        this.dataservice.showSnackBar('Not found');
      }
    }
    else{
      this.modal.holiday = new Holiday();
    }
  }

  closeModal() {
    this.modal.show = false;
    this.modal.module = ModuleType.EMPLOYEE;
    this.modal.action = Action.NONE;
    this.modal.isEdit = false;
    this.modal.title = '';
    this.modal.holiday = new Holiday();
  }

  saveHoliday(){
    const payload = {... this.modal.holiday}
    this.holidayManagementServiceService.saveHoliday(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
        
          this.dataservice.showSnackBar('Holiday saved successfully');
          this.getHolidaysList();
          this.closeModal();
        }
      }
    )

  }

}
