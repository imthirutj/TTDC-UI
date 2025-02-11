import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
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

  @Input() filters: any = {};

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
    private dataService: DataService
  ) {
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel, this.user);
      this.activate();
      this.triggerParentFunction.emit();
    });
  }
  //#endregion

 

  ngOnInit(): void {
    if (this.filters) {
      this.filters.role = this.filters.role || { value: '', show: false, includeInSearchParams:false, key: 'role' };
      this.filters.selectedMonth = this.filters.selectedMonth || { value: Number(new Date().getMonth()) + 1, show: false,  includeInSearchParams:true,key: 'selectedMonth',  };
      this.filters.selectedYear = this.filters.selectedYear || { value: new Date().getFullYear(), show: false, includeInSearchParams:true, key: 'selectedYear' };
      this.filters.cityId = this.filters.cityId || { value: '', show: false, includeInSearchParams:false, key: 'cityId' };
      this.filters.companyId = this.filters.companyId || { value: '', show: false, includeInSearchParams:false, key: 'companyId' };
      this.filters.designationId = this.filters.designationId || { value: '', show: false, includeInSearchParams:false, key: 'designationId' };
      this.filters.deptId = this.filters.deptId || { value: '', show: false, includeInSearchParams:false, key: 'deptId' };
      this.filters.catId = this.filters.catId || { value: '', show: false, includeInSearchParams:false, key: 'catId' };
      this.filters.employeeId = this.filters.employeeId || { value: '', show: false, includeInSearchParams:false, key: 'employeeId' };
      this.filters.employeeName = this.filters.employeeName || { value: '', show: false, includeInSearchParams:false, key: 'employeeName' };
      this.filters.employeeCode = this.filters.employeeCode || { value: '', show: false, includeInSearchParams:false, key: 'employeeCode' };
      this.filters.vendorId = this.filters.vendorId || { value: '', show: false, includeInSearchParams:false, key: 'vendorId' };
      this.filters.vendorName = this.filters.vendorName || { value: '', show: false,  includeInSearchParams:false,key: 'vendorName' };

      this.filters.managerId = this.filters.managerId || { value: '', show: false, includeInSearchParams:false, key: 'managerId' };
      this.filters.managerName = this.filters.managerName || { value: '', show: false, includeInSearchParams:false, key: 'managerName' };
    }

    // Ensure all filters have a `show` property set to false if missing
    Object.keys(this.filters).forEach((key) => {
      if (this.filters[key] && this.filters[key].show === undefined) {
        this.filters[key].show = false; 
        this.filters[key].includeInSearchParams = false; 
      }
    });

    this.fetchCities();
    this.fetchDepartments();
    this.fetchDesignations();
    this.fetchCategories();
    this.fetchVendors();
    this.fetchCompanies();

  }

  activate() {
    this.filters.role.value = this.userAccessLevel;
    if (this.userAccessLevel == UserType.VENDOR) {
      this.filters.vendorId.value = this.user.vendorId;
      this.filters.vendorId.show = false;

      this.filters.vendorName.show = false;

      this.filters.cityId.show = false;
      this.filters.companyId.show = false;
      this.filters.deptId.show = false;
    }
    if (this.userAccessLevel == UserType.MANAGER) {
      this.filters.cityId.show = false;
      this.filters.companyId.show = false;
      this.filters.companyId.value = this.user.companyId;

      this.fetchVendors();
    }

    if (this.userAccessLevel == UserType.EMPLOYEE) {
      this.filters.cityId.show = false;
      
      this.filters.companyId.show = false;
      this.filters.companyId.value = this.user.companyId;

      this.filters.designationId.show = false;
      this.filters.deptId.show = false;
      this.filters.catId.show = false;

      this.filters.employeeId.show = false;
      this.filters.employeeId.includeInSearchParams = true;
      this.filters.employeeId.value = this.user.employeeId;

      this.filters.employeeCode.show = false;
      this.filters.employeeCode.includeInSearchParams = false;
      this.filters.employeeCode.value = this.user.employeeCode;

      this.filters.employeeName.show = false;
      this.filters.employeeName.includeInSearchParams = false;
      this.filters.employeeName.value = this.user.employeeName;

      this.filters.managerId.show = false;
      this.filters.managerId.value = this.user.managerId;

      this.filters.managerName.show = false;
      this.filters.managerName.value = this.user.managerName; 


      this.filters.vendorId.value = this.user.vendorId;
      this.filters.vendorId.show = false;
    }

    //Set Def VAlue for all
    this.filters.catId.show = false;
    this.filters.catId.includeInSearchParams = false;
    this.filters.catId.value = 0;

    this.filters.cityId.show = false;
    this.filters.cityId.includeInSearchParams = false;
    this.filters.cityId.value = 0;
  }

  //#region Change Event
  onFilterChange() {
    this.filterChanged.emit();
  }

  onCityChange() {
    this.fetchCompanies();
    this.onFilterChange();
  }

  onCompanyChange() {
    this.fetchVendors();
    this.onFilterChange();
  }

  onVendorNameChange(){
    this.onFilterChange();
  }

  onDesignationChange() {
    this.onFilterChange();
  }

  onDepartmentChange() {
    this.fetchVendors();
    this.onFilterChange();
  }

  onCategoryChange() {
    this.onFilterChange();
  }

  onEmployeeChange() {
    this.onFilterChange();
  }

  onVendorChange() {
    this.onFilterChange();
  }
  //#endregion

  //#region Fetch
  fetchCities() {
    const payload = { stateId: 1 }; // Adjust payload logic if needed
    this.masterDataService.getCity(payload).subscribe((response) => {
      if (response.success) {
        this.cities = response.data;
      }
    });
  }

  fetchCompanies() {
    const payload = { cityId: this.filters.cityId.value };
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
    const payload = {
      cityId: this.filters.cityId.value,
      compId: this.filters.companyId.value,
      deptId: this.filters.deptId.value,
      skipMapping:true
    }
    this.masterDataService.getVendors(payload).subscribe((response) => {
      if (response.success) this.vendors = response.data;
    });
  }


  showDialog: boolean = false;
  openFilterModal(){
    this.showDialog = true;
  }

  search(){
    this.triggerParentFunction.emit();
    this.showDialog = false;
  }

  changeMonth(direction: number) {
    let currentMonth = this.filters.selectedMonth.value;
    let currentYear = this.filters.selectedYear.value;
  
    if (direction === -1) {
      // Move to previous month
      if (currentMonth === 1) {
        this.filters.selectedMonth.value = 12; // Go to December
        this.filters.selectedYear.value = currentYear - 1; // Decrease year
      } else {
        this.filters.selectedMonth.value = currentMonth - 1;
      }
    } else if (direction === 1) {
      // Move to next month
      if (currentMonth === 12) {
        this.filters.selectedMonth.value = 1; // Go to January
        this.filters.selectedYear.value = currentYear + 1; // Increase year
      } else {
        this.filters.selectedMonth.value = currentMonth + 1;
      }
    }
  
    this.onFilterChange(); // Emit the filter change event
  }
  
  //#endregion
}
