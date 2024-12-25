import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DropdownConfigService } from '../utils/shared/dropdown-config.service';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { ShiftManagementService } from './shift-management.service';

@Component({
  selector: 'app-shift-management',
  templateUrl: './shift-management.component.html',
  styleUrls: ['./shift-management.component.css']
})
export class ShiftManagementComponent {

  // Mocked data from the APIs
  states:any[] = [];

  cities:any[] = [];

  companies:any[] = [
    { companyId: 1, companyFName: 'Default' },
    { companyId: 2, companyFName: 'Test Company' }
  ];

  employees:any[] = [
    { employeeId: 1, employeeName: 'John Doe', shift: 'Morning' },
    { employeeId: 2, employeeName: 'Jane Smith', shift: 'Afternoon' },
  ];

  // Selected values for dropdowns
  selectedStateId: any  = '';
  selectedCityId: any  = '';
  selectedCompanyId: any  = '';

  fromDate: string | null = null;
  toDate: string | null = null;


  constructor(
        private fb: FormBuilder,
        public dropDownConfigService: DropdownConfigService,
        private masterDataService: MasterDataService,
        private dataService: DataService, 
        private shiftManagementService: ShiftManagementService
  ) { 


  }

  ngOnInit() {
    this.activate();
  }

  activate(){
    this.fetchStates();
  }
  
  fetchStates() {
    this.masterDataService.getStates().subscribe((response) => {
      if(response.success){
        this.states = response.data;
      }
    });
  }

  //#region  Fetch
  fetchCities() {
    var payload = {
      stateId:this.selectedStateId
    }
    this.masterDataService.getCity(payload).subscribe((response) => {
      if(response.success){
        this.cities = response.data;
      }
    });
  }

  fetchCompanies() {
    var payload ={
      cityId:this.selectedCityId
    }
    this.masterDataService.getCompany(payload).subscribe((response) => {
      if(response.success){
        this.companies = response.data;
      }
    });
  }

  filterEmployees() {
    if (!this.fromDate || !this.toDate) {
     this.dataService.showSnackBar('From Date and To Date are mandatory.');
      return;
    }
    if (this.toDate < this.fromDate) {
      this.dataService.showSnackBar('To Date cannot be earlier than From Date.');
      return;
    }

    var payload = {
      cityId: this.selectedCityId,
      companyId: this.selectedCompanyId,
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    console.log('Filter payload:', payload);
    this.shiftManagementService.getEmployeeShifts(payload).subscribe((response) => {
      if (response.success) {
        this.employees = response.data;
      }
    });
  }
  //#endregion


  //#region OnChange Event
  onStateChange() {
    this.selectedCityId  = '';
    this.selectedCompanyId  = '';
    this.fetchCities();

  }

  onCityChange() {
    this.selectedCompanyId  = '';
    this.fetchCompanies();
  }

  onCompanyChange() {
    
  }

//#endregion

  editShift(employee: any) {
    employee.shift = prompt('Edit shift:', employee.shift) || employee.shift;
  }
}
