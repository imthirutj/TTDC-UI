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

  @Input() filters: any = {
    selectedMonth: { value: Number(new Date().getMonth()) + 1, show: false, key: 'selectedMonth' },
    selectedYear: { value: new Date().getFullYear(), show: false, key: 'selectedYear' },
    cityId: { value: '', show: true, key: 'cityId' },
    companyId: { value: '', show: true, key: 'companyId' },
    designationId: { value: '', show: true, key: 'designationId' },
    deptId: { value: '', show: true, key: 'deptId' },
    catId: { value: '', show: true, key: 'catId' },
    employeeId: { value: '', show: true, key: 'employeeId' },
    vendorId: { value: '', show: true, key: 'vendorId' }
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
    private dataService: DataService
  ) {
    this.dataService.asyncGetUser().then((user: any) => {
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

  activate() {
    if (this.userAccessLevel == UserType.VENDOR) {
      this.filters.vendorId.value = this.user.vendorId;
      this.filters.vendorId.show = false;
    }
    if (this.userAccessLevel == UserType.MANAGER) {
      this.filters.cityId.show = false;
      this.filters.companyId.show = false;
      this.filters.companyId.value = this.user.companyId;
    }

    if (this.userAccessLevel == UserType.EMPLOYEE) {
      this.filters.cityId.show = false;
      this.filters.companyId.show = false;
      this.filters.companyId.value = this.user.companyId;

      this.filters.designationId.show = false;
      this.filters.deptId.show = false;
      this.filters.catId.show = false;
      this.filters.employeeId.show = false;

      this.filters.employeeId.value = this.user.employeeId;
    }
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
    this.onFilterChange();
  }

  onDesignationChange() {
    this.onFilterChange();
  }

  onDepartmentChange() {
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
    this.masterDataService.getVendors().subscribe((response) => {
      if (response.success) this.vendors = response.data;
    });
  }
  //#endregion
}
