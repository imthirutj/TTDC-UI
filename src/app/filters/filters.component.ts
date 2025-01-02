import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { MasterDataService } from '../services/master-data.service'; // Make sure to import your service
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';

@Component({
  selector: 'app-filter',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  @Input() filters: { 
    selectedMonth: number, 
    selectedYear: number, 
    cityId: string,
    companyId: string,
    designationId: string,
    deptId: string,
    catId:string,
    employeeId:string,
    vendorId:string,
    visibility:{
      showMonthDropdown: boolean,
      showYearDropdown: boolean,
      showCityDropdown: boolean,
      showCompanyDropdown: boolean,
      showDesignationDropdown: boolean,
      showDepartmentDropdown: boolean,
      showCategoryDropdown: boolean,
      showEmployeeDropdown: boolean,
      showVendorDropdown: boolean
    }
  } = { // Provide a default value for filters
    selectedMonth: 1,
    selectedYear: 1,
    cityId: '',
    companyId:'',
    designationId:'',
    deptId:'',
    catId:'',
    employeeId:'',
    vendorId:'',
    visibility:{
      showMonthDropdown: false,
    showYearDropdown: false,
    showCityDropdown: false,
    showCompanyDropdown: false,
    showDesignationDropdown: false,
    showDepartmentDropdown: false,
    showCategoryDropdown: false,
    showEmployeeDropdown: false,
    showVendorDropdown: false
    }
  };

  @Output() filterChanged = new EventEmitter<{ month: number, year: number, cityId: string }>();
  @Output() triggerParentFunction = new EventEmitter<void>();

  UserType = UserType;

  user: any;
  userAccessLevel: any;

  months = myMonths;
  years = myYears;
  cities: any[] = []; // Store cities

  companies: any[] = [];
  designations: any[] = [];
  departments: any[] = [];
  categories: any[] = [];
  vendors: any[] = [];


  //#region Constructor
  constructor(private masterDataService: MasterDataService,
    private dataService:DataService
  ) {
    this.dataService.asyncGetUser().then((user:any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);
      this.activate();
      this.triggerParentFunction.emit();
    });
  }
  //#endregion

  ngOnInit(): void {
    this.fetchCities();
    this.fetchDepartments();
    this.fetchDesignations();
    this.fetchCategories();
    this.fetchVendors();
  }

  activate(){
    if(this.userAccessLevel == UserType.VENDOR){
      this.filters.vendorId = this.user.vendorId;
      this.filters.visibility.showVendorDropdown = false;
    }
    if(this.userAccessLevel == UserType.MANAGER){
      this.filters.visibility.showCityDropdown = false;
      this.filters.visibility.showCompanyDropdown = false;
      this.filters.companyId = this.user.companyId;
    }

    if(this.userAccessLevel == UserType.EMPLOYEE){
      this.filters.visibility.showCityDropdown = false;

      this.filters.visibility.showCompanyDropdown = false;
      this.filters.companyId = this.user.companyId;

      this.filters.visibility.showDesignationDropdown = false;
      this.filters.visibility.showDepartmentDropdown = false;
      this.filters.visibility.showCategoryDropdown = false;

      this.filters.visibility.showEmployeeDropdown = false;
      this.filters.employeeId = this.user.employeeId;  
    }
  }
  //#region Change Event
  onFilterChange() {
    this.filterChanged.emit({
      month: this.filters.selectedMonth,
      year: this.filters.selectedYear,
      cityId: this.filters.cityId
    });
  }

  onCityChange(){
    this.fetchCompanies();
    this.onFilterChange();
  }

  onCompanyChange(){
    this.onFilterChange();
  }

  onDesignationChange(){
    this.onFilterChange();
  }

  onDepartmentChange(){
    this.onFilterChange();
  }

  onCategoryChange(){
    this.onFilterChange();
  }

  onEmployeeChange(){
    this.onFilterChange();
  }

  onVendorChange(){
    this.onFilterChange();
  }
  //#endregion


  //#region Fetch
  fetchCities() {
    const payload = { stateId: 1}; // Adjust payload logic if needed
    this.masterDataService.getCity(payload).subscribe((response) => {
      if (response.success) {
        this.cities = response.data;
      }
    });
  }

  fetchCompanies() {
    const payload = { cityId: this.filters.cityId };
    this.masterDataService.getCompany(payload).subscribe((response) => {
      if (response.success) this.companies = response.data;
    });
  }

  fetchDesignations() {
    this.masterDataService.getDesignation().subscribe((response) => {
      if (response.success) this.designations = response.data;
    });
  }

  fetchDepartments() {
    this.masterDataService.getDepartment().subscribe((response) => {
      if (response.success) this.departments = response.data;
    });
  }

  fetchCategories() {
    this.masterDataService.getCategory().subscribe((response) => {
      if (response.success) this.categories = response.data;
    });
  }

  fetchVendors() {
    this.masterDataService.getVendors().subscribe((response) => {
      if (response.success) this.vendors = response.data;
    });
  }

  //#endregion
}
