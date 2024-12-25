import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DropdownConfigService } from '../utils/shared/dropdown-config.service';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';

@Component({
  selector: 'app-shift-management',
  templateUrl: './shift-management.component.html',
  styleUrls: ['./shift-management.component.css']
})
export class ShiftManagementComponent {

  // Mocked data from the APIs
  states:any[] = [];

  cities:any[] = [
    { cityId: 1, cityName: 'Chennai', stateId: 1, stateName: 'Tamilnadu' },
    { cityId: 2, cityName: 'Coimbatore', stateId: 1, stateName: 'Tamilnadu' }
  ];

  companies:any[] = [
    { companyId: 1, companyFName: 'Default' },
    { companyId: 2, companyFName: 'Test Company' }
  ];

  employees:any[] = [
    { employeeId: 1, employeeName: 'John Doe', shift: 'Morning' },
    { employeeId: 2, employeeName: 'Jane Smith', shift: 'Afternoon' },
  ];

  // Selected values for dropdowns
  selectedStateId: number | null = null;
  selectedCityId: number | null = null;
  selectedCompanyId: number | null = null;
  selectedMonth: number | null = null;
  selectedYear: number | null = null;

  // This will hold the filtered employee list
  filteredEmployees:any[] = [];

  constructor(
        private fb: FormBuilder,
        public dropDownConfigService: DropdownConfigService,
        private masterDataService: MasterDataService,
        private dataService: DataService, 
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


  //#region OnChange Event
  onStateChange() {
    this.selectedCityId = null; 
    this.selectedCompanyId = null;
    this.selectedMonth = null;
    this.selectedYear = null;
    this.fetchCities();

  }

  onCityChange() {
    this.selectedCompanyId = null;
    this.selectedMonth = null;
    this.selectedYear = null;
  }

  onCompanyChange() {
    
    this.filteredEmployees = this.employees;
  }

  onMonthYearChange() {
    if (this.selectedCompanyId) {
      this.filteredEmployees = this.employees;
    }
  }
//#endregion

  editShift(employee: any) {
    employee.shift = prompt('Edit shift:', employee.shift) || employee.shift;
  }
}
