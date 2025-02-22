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

  oldFilters: any = {};
  originalFilters: any = {};

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
      // this.filters.role = this.filters.role || { value: '', show: false, includeInSearchParams:false, key: 'role' };
      // this.filters.selectedMonth = this.filters.selectedMonth || { value: Number(new Date().getMonth()) + 1, show: false,  includeInSearchParams:true,key: 'selectedMonth',  };
      // this.filters.selectedYear = this.filters.selectedYear || { value: new Date().getFullYear(), show: false, includeInSearchParams:true, key: 'selectedYear' };
      // this.filters.cityId = this.filters.cityId || { value: '', show: false, includeInSearchParams:false, key: 'cityId' };
      // this.filters.companyId = this.filters.companyId || { value: '', show: false, includeInSearchParams:false, key: 'companyId' };
      // this.filters.designationId = this.filters.designationId || { value: '', show: false, includeInSearchParams:false, key: 'designationId' };
      // this.filters.deptId = this.filters.deptId || { value: '', show: false, includeInSearchParams:false, key: 'deptId' };
      // this.filters.catId = this.filters.catId || { value: '', show: false, includeInSearchParams:false, key: 'catId' };
      // this.filters.employeeId = this.filters.employeeId || { value: '', show: false, includeInSearchParams:false, key: 'employeeId' };
      // this.filters.employeeName = this.filters.employeeName || { value: '', show: false, includeInSearchParams:false, key: 'employeeName' };
      // this.filters.employeeCode = this.filters.employeeCode || { value: '', show: false, includeInSearchParams:false, key: 'employeeCode' };
      // this.filters.vendorId = this.filters.vendorId || { value: '', show: false, includeInSearchParams:false, key: 'vendorId' };
      // this.filters.vendorName = this.filters.vendorName || { value: '', show: false,  includeInSearchParams:false,key: 'vendorName' };

      // this.filters.managerId = this.filters.managerId || { value: '', show: false, includeInSearchParams:false, key: 'managerId' };
      // this.filters.managerName = this.filters.managerName || { value: '', show: false, includeInSearchParams:false, key: 'managerName' };

      // this.filters.qualificationMismatched = this.filters.qualificationMismatched || { value: '0', show: false,  includeInSearchParams:false,key: 'qualificationMismatched' };
      // this.filters.loggedInType = this.filters.loggedInType || { value: '0', show: false,  includeInSearchParams:false,key: 'loggedInType' };


     
        const filterDefaults = [
          { key: 'role', label: 'Role', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'selectedMonth', label: 'Month', defaultValue: new Date().getMonth() + 1, show: false, includeInSearchParams: true },
          { key: 'selectedYear', label: 'Year', defaultValue: new Date().getFullYear(), show: false, includeInSearchParams: true },
          { key: 'cityId', label: 'City', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'companyId', label: 'Company', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'designationId', label: 'Designation', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'deptId', label: 'Department', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'catId', label: 'Category', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'employeeId', label: 'Employee ID', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'employeeName', label: 'Employee Name', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'employeeCode', label: 'Employee Code', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'vendorId', label: 'Vendor ID', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'vendorName', label: 'Vendor Name', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'managerId', label: 'Manager ID', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'managerName', label: 'Manager Name', defaultValue: '', show: false, includeInSearchParams: false },
          { key: 'qualificationMismatched', label: 'Qualification Mismatched', defaultValue: '0', show: false, includeInSearchParams: false },
          { key: 'loggedInType', label: 'Logged In Type', defaultValue: '0', show: false, includeInSearchParams: false },
          { key: 'attnNotFilled', label: 'Attendance Filter', defaultValue: '0', show: false, includeInSearchParams: false },
          { key: 'salaryRangeMin', label: 'Salary Range :Min', defaultValue: '0', show: false, includeInSearchParams: false },
          { key: 'salaryRangeMax', label: 'Salary Range :Max', defaultValue: '0', show: false, includeInSearchParams: false },
          { key: 'otherDeductionsMin', label: 'Other Deductions Range :Min', defaultValue: '0', show: false, includeInSearchParams: false },
          { key: 'otherDeductionsMax', label: 'Other Deductions Range :Max', defaultValue: '0', show: false, includeInSearchParams: false }
        ];
    
        // Ensure filters are properly initialized
        filterDefaults.forEach(filter => {
          if (!this.filters.hasOwnProperty(filter.key) || typeof this.filters[filter.key] !== 'object') {
            // If the filter does not exist or is not an object, initialize it
            this.filters[filter.key] = {
              value: filter.defaultValue,
              show: filter.show,
              includeInSearchParams: filter.includeInSearchParams,
              key: filter.key,
              label: filter.label
            };
          }
          else{
            this.filters[filter.key].label = filter.label;
          } 
        });
      
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

    this.originalFilters = JSON.parse(JSON.stringify(this.filters));
  }

  activate() {
    this.filters.role.value = this.userAccessLevel;

    if(this.userAccessLevel == UserType.CITY_ADMIN){
      this.filters.cityId.value = this.user.cityId;
      this.filters.cityId.show = false;
      this.filters.cityId.includeInSearchParams = true;

      this.fetchCompanies();

    }
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
      this.filters.cityId.includeInSearchParams = false;
      this.filters.cityId.value = 0;
      
      this.filters.companyId.show = false;
      this.filters.companyId.value = this.user.companyId;

      this.fetchVendors();
    }

    if (this.userAccessLevel == UserType.EMPLOYEE) {
      this.filters.cityId.show = false;
      
      this.filters.companyId.show = false;
      this.filters.companyId.value = this.user.companyId;

      this.filters.cityId.show = false;
      this.filters.cityId.includeInSearchParams = false;
      this.filters.cityId.value = 0;

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

      this.filters.loggedInType.value = '0';
      this.filters.loggedInType.show = false;
    }

    //Set Def VAlue for all
    this.filters.catId.show = false;
    this.filters.catId.includeInSearchParams = false;
    this.filters.catId.value = 0;

    
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

  onQualificationMismatchChange(){
    this.onFilterChange();
  }
  onLoginTypeChange(){
    this.onFilterChange();
  }
  onAttnFilledChange(){
    this.onFilterChange();
  }
  onSalaryRangeChange(){
    this.onFilterChange();
  }
  onOtherDeductionshange(){
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


  getFilteredFields() {
    const filteredFields: any[] = [];
  
    Object.keys(this.filters).forEach((key) => {
      const filter = this.filters[key];
      if (filter.show && filter.value) {  
        let displayValue = filter.value; // Default to the stored value
  
        // Map numerical values to their corresponding names
        if (key === 'selectedMonth') {
          displayValue = this.dataService.monthNames[filter.value - 1];
        } else if (key === 'selectedYear') {
          displayValue = filter.value; // Year can be displayed as is
        } else if (key === 'designationId') {
          const designationObj = this.designations.find(d => d.designationId == filter.value);
          displayValue = designationObj ? designationObj.designationName  : filter.value; // Use .name
        } else if (key === 'deptId') {
          const deptObj = this.departments.find(d => d.departmentId == filter.value);
          displayValue = deptObj ? deptObj.name : filter.value; // Use .name
        } else if (key === 'vendorId') {
          const vendorObj = this.vendors.find(v => v.value == filter.value);
          displayValue = vendorObj ? vendorObj.name : filter.value; // Use .name
        } else if (key === 'loggedInType') {
          displayValue = filter.value === '0' ? 'Guest' : 'Logged In';  // Example mapping
        }
  
        filteredFields.push({
          name: key,  
          value: displayValue,  // Use the mapped label instead of the numeric value
          label: filter.label || key  // Ensure label exists
        });
      }
    });
  
    return filteredFields;
  }
  
  resetFilters() {
    this.filters = JSON.parse(JSON.stringify(this.originalFilters)); // Restore original filters
 
    this.onFilterChange();
  }
  

}
