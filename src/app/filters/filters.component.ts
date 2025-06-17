import { Component, EventEmitter, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { MasterDataService } from '../services/master-data.service'; // Make sure to import your service
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';
import { el } from '@fullcalendar/core/internal-common';
import { Router } from '@angular/router';

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

  shiftTypes: string[] = [
    'WEEKOFF',
    // 'HOLIDAY', 
    'MORNING',
    'AFTERNOON',
    'NIGHT',
    'GENERAL',
    'BREAK'
  ];

  //#region Constructor
  constructor(private masterDataService: MasterDataService,
    public dataService: DataService,
    private router: Router
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
    this.dataService.setUnitName('');
    if (this.filters) {
      const filterDefaults = [
        { objName: 'display', key: 'display', label: 'display', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'reqStatus', key: 'reqStatus', label: 'Status', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'date', key: 'date', label: 'Date', defaultValue: new Date().toISOString().split('T')[0], show: false, includeInSearchParams: false },


        { objName: 'role', key: 'role', label: 'Role', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'selectedMonth', key: 'month', label: 'Month', defaultValue: new Date().getMonth() + 1, show: false, includeInSearchParams: true },
        { objName: 'selectedYear', key: 'year', label: 'Year', defaultValue: new Date().getFullYear(), show: false, includeInSearchParams: true },
        { objName: 'cityId', key: 'cityId', label: 'Region', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'companyId', key: 'companyId', label: 'Unit', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'designationId', key: 'designationId', label: 'Designation', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'deptId', key: 'deptId', label: 'Section', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'catId', key: 'catId', label: 'Category', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'employeeId', key: 'employeeId', label: 'Employee ID', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'employeeName', key: 'employeeName', label: 'Employee Name', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'employeeCode', key: 'employeeCode', label: 'Employee Code', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'employementType', key: 'employementType', label: 'Employement Type', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'vendorId', key: 'vendorId', label: 'Vendor', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'vendorName', key: 'vendorName', label: 'Vendor Name', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'managerId', key: 'managerId', label: 'Manager', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'managerName', key: 'managerName', label: 'Manager Name', defaultValue: '', show: false, includeInSearchParams: false },
        { objName: 'qualificationMismatched', key: 'qualificationMismatched', label: 'Qualification Mismatched', defaultValue: '0', show: false, includeInSearchParams: false },
        { objName: 'loggedInType', key: 'loggedInType', label: 'Logged In Type', defaultValue: '0', show: false, includeInSearchParams: false },
        { objName: 'attnNotFilled', key: 'attnNotFilled', label: 'Attendance Filter', defaultValue: '0', show: false, includeInSearchParams: false },
        { objName: 'salaryRangeMin', key: 'salaryRangeMin', label: 'Salary Range(Min)', defaultValue: '0', show: false, includeInSearchParams: false },
        { objName: 'salaryRangeMax', key: 'salaryRangeMax', label: 'Salary Range(Max)', defaultValue: '0', show: false, includeInSearchParams: false },
        { objName: 'otherDeductionsMin', key: 'otherDeductionsMin', label: 'Other Deductions Range(Min)', defaultValue: '0', show: false, includeInSearchParams: false },
        { objName: 'otherDeductionsMax', key: 'otherDeductionsMax', label: 'Other Deductions Range(Max)', defaultValue: '0', show: false, includeInSearchParams: false },

        { objName: 'filterRange', key: 'filterRange', label: 'Filter Range', defaultValue: '0', show: false, includeInSearchParams: true },

        { objName: 'fromMonth', key: 'fromMonth', label: 'From Month', defaultValue: new Date().getMonth() + 1, show: false, includeInSearchParams: true },
        { objName: 'fromYear', key: 'fromYear', label: 'From Year', defaultValue: new Date().getFullYear(), show: false, includeInSearchParams: true },
        { objName: 'toMonth', key: 'toMonth', label: 'To Month', defaultValue: new Date().getMonth() + 1, show: false, includeInSearchParams: true },
        { objName: 'toYear', key: 'toYear', label: 'To Year', defaultValue: new Date().getFullYear(), show: false, includeInSearchParams: true },

        { objName: 'shiftStatus', key: 'shiftStatus', label: 'Shift Status', defaultValue: '', show: false, includeInSearchParams: false },

        { objName: 'activeStatus', key: 'activeStatus', label: 'Active Status', defaultValue: 'ACTIVE', show: false, includeInSearchParams: false },

        { objName: 'fromDate', key: 'fromDate', label: 'From Date', defaultValue: new Date().toISOString().split('T')[0], show: false, includeInSearchParams: false },
        { objName: 'toDate', key: 'toDate', label: 'To Date', defaultValue: new Date().toISOString().split('T')[0], show: false, includeInSearchParams: false },

        { objName: 'leaveReqStatus', key: 'leaveReqStatus', label: 'Leave Request Status', defaultValue: 'ALL', show: false, includeInSearchParams: false },
        { objName: 'odReqStatus', key: 'odReqStatus', label: 'OD Request Status', defaultValue: 'ALL', show: false, includeInSearchParams: false },
        { objName: 'logType', key: 'logType', label: 'Today LoggedIn Filter', defaultValue: 'ALL', show: false, includeInSearchParams: false },

        { objName: 'filterPfCredited', key: 'filterPfCredited', label: 'Pf Credited', defaultValue: 'ALL', show: false, includeInSearchParams: false },
      ];

      // Ensure filters are properly initialized
      filterDefaults.forEach(filter => {
        if (!this.filters.hasOwnProperty(filter.objName) || typeof this.filters[filter.objName] !== 'object') {
          // If the filter does not exist or is not an object, initialize it
          this.filters[filter.objName] = {
            value: filter.defaultValue,
            show: filter.show,
            includeInSearchParams: filter.includeInSearchParams,
            key: filter.key,
            label: filter.label
          };
        }
        else {
          this.filters[filter.objName].label = filter.label;
        }
      });

      if (this.filters.filterRange.value == 0) {
        this.filters.fromMonth.value = 0;
        this.filters.fromYear.value = 0;
        this.filters.toMonth.value = 0;
        this.filters.toYear.value = 0
      }
      else {
        this.filters.selectedMonth.value = 0;
        this.filters.selectedYear.value = 0;
      }

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

    if (this.userAccessLevel == UserType.CITY_ADMIN) {
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
      this.filters.companyId.show = true;
      this.filters.deptId.show = false;

      this.fetchCompanies();
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

      this.filters.shiftStatus.show = false;
      this.filters.shiftStatus.includeInSearchParams = false;
      this.filters.shiftStatus.value = '';
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

  onVendorNameChange() {
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

  onEmployementTypeChange(){
    this.onFilterChange();
  }

  onVendorChange() {
    this.onFilterChange();
  }

  onQualificationMismatchChange() {
    this.onFilterChange();
  }
  onLoginTypeChange() {
    this.onFilterChange();
  }
  onAttnFilledChange() {
    this.onFilterChange();
  }
  onSalaryRangeChange() {
    this.onFilterChange();
  }
  onOtherDeductionshange() {
    this.onFilterChange();
  }
  onActiveStatusChange() {
    this.onFilterChange();
  }
  onShiftStatuschange() {
    this.onFilterChange();
  }

  onFromDateChange() {
    this.onFilterChange();
  }
  onToDateChange() {
    this.onFilterChange();
  }
  onDateChange() {
    this.onFilterChange();
  }
  onLeaveRequestStatusChange() {
    this.onFilterChange();
  }

  onOdRequestStatusChange() {
    this.onFilterChange();
  }

  onLogTypeChange() {
    this.onFilterChange();
  }

  onPfCreditedChange(){
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
    let payload:any = { 
      cityId: this.filters.cityId.value,
      vendorId: this.filters.vendorId.value
    };
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
      skipMapping: true
    }
    this.masterDataService.getVendors(payload).subscribe((response) => {
      if (response.success) this.vendors = response.data;
    });
  }


  showDialog: boolean = false;
  openFilterModal() {
    this.showDialog = true;
  }

  search() {
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
  
    let fromMonth = '';
    let fromYear = '';
    let toMonth = '';
    let toYear = '';
  
    let fromDate = '';
    let toDate = '';
  
    Object.keys(this.filters).forEach((key) => {
      const filter = this.filters[key];
      if (filter.show && filter.value) {
        let displayValue = filter.value;
  
        if (key === 'fromMonth') {
          fromMonth = this.dataService.monthNames[filter.value - 1]; 
          return;
        } else if (key === 'toMonth') {
          toMonth = this.dataService.monthNames[filter.value - 1]; 
          return;
        } else if (key === 'fromYear') {
          fromYear = filter.value;
          return;
        } else if (key === 'toYear') {
          toYear = filter.value;
          return;
        } else if (key === 'fromDate') {
          fromDate = filter.value;
          return; // **Skip adding individual fromDate**
        } else if (key === 'toDate') {
          toDate = filter.value;
          return; // **Skip adding individual toDate**
        } else if (key === 'designationId') {
          const designationObj = this.designations.find(d => d.designationId == filter.value);
          displayValue = designationObj ? designationObj.designationName : filter.value;
        } else if (key === 'deptId') {
          const deptObj = this.departments.find(d => d.departmentId == filter.value);
          displayValue = deptObj ? deptObj.departmentFName : filter.value;
        } else if (key === 'vendorId') {
          const vendorObj = this.vendors.find(v => v.vendorId == filter.value);
          displayValue = vendorObj ? vendorObj.vendorName : filter.value;
        } else if (key === 'cityId') {
          const cityObj = this.cities.find(c => c.cityId == filter.value);
          displayValue = cityObj ? cityObj.cityName : filter.value;
        } else if (key === 'companyId') {
          const companyObj = this.companies.find(c => c.companyId == filter.value);
          displayValue = companyObj ? companyObj.companyFName : filter.value;
          this.dataService.setUnitName(companyObj.companyFName);
        }
  
        filteredFields.push({
          name: key,
          value: displayValue,
          label: filter.label || key
        });
      }
    });
  
    // Add Month-Year Range
    if (fromMonth && fromYear && toMonth && toYear) {
      filteredFields.unshift({
        name: 'monthYearRange',
        value: `From: ${fromMonth} ${fromYear} To: ${toMonth} ${toYear}`,
        label: 'Period'
      });
    }
  
    // Add Date Range (only once)
    if (fromDate && toDate) {
      filteredFields.unshift({
        name: 'dateRange',
        value: ` ${fromDate} To ${toDate}`,
        label: 'Date Range'
      });
    }
  
    return filteredFields;
  }
  
  

  resetFilters() {
    //reload all compoent
    window.location.reload();
    
  }


}
