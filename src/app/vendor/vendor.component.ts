import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';
import { myMonths, myYears } from '../utils/helpers/variables';
import { VendorService } from './vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  UserType = UserType;
  userAccessLevel: any;
  user: any;

  states: any[] = [];
  cities: any[] = [];
  companies: any[] = [{ companyId: 1, companyFName: 'Default' }];

  selectedStateId: any = '';
  selectedCityId: any = '';
  selectedCompanyId: any = '';


  months = myMonths;
  years = myYears;


  companyVendors: any;

  isVendorModalOpen: boolean = false;
  selectedVendor: any ={};

  
  filters: any = {
    selectedMonth: {
      value: Number(new Date().getMonth()) + 1, // Default to current month
      show: true,
      key: 'month',
      includeInSearchParams: true
    },
    selectedYear: {
      value: new Date().getFullYear(), // Default to current year
      show: true,
      key: 'year',
      includeInSearchParams: true
    },
    companyId: {
      value: '',
      show: false,
      key: 'compId',
      includeInSearchParams: false
    },
    vendorId: {
      value: '',
      show: true,
      key: 'vendorId',
      includeInSearchParams: true
    },
  };
  constructor(
    private router: Router,
    private masterDataService: MasterDataService,
    private dataService: DataService,
    private vendorService: VendorService
  ) {
    this.dataService.asyncGetUser().then((user:any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);

    });
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.fetchPayRecordsbyComp();
  }

  search(){
    this.fetchPayRecordsbyComp();
  }


  ngOnInit(): void {
    this.fetchStates();
    this.fetchPayRecordsbyComp();
  }


  //#region  Fetch

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

  fetchPayRecordsbyComp(){
    const payload = this.dataService.getPayloadValue(this.filters);
    this.vendorService.getPayRecordsbyComp(payload).subscribe((response:any) => {
      if (response.success) {
        this.companyVendors = response.data;
      }
    })
  }

  //#endregion



  //#region  OnChange

  onStateChange() {
    this.selectedCityId = '';
    this.selectedCompanyId = '';
    this.fetchCities();
  }

  onCityChange() {
    this.selectedCompanyId = '';
    this.fetchCompanies();
  }

  onCompanyChange() {
  }


  // Method to update the selected month and year and regenerate the date range
  onMonthYearChange(): void {

  }

  // Update shifts on change
  onShiftChange(employee: any, date: string): void {
    console.log(`${employee.name}'s shift on ${date} changed to ${employee.shifts[date]}`);
  }


  //#endregion

  openVendorModal(vendor: any) {
    this.isVendorModalOpen = true;
    this.selectedVendor = vendor;
  }
  updateVendorModal() {
    var payload = {
      ...this.selectedVendor
    }
    this.vendorService.updateVendorPayments(this.selectedVendor).subscribe((response: any) => {
      if (response.success) {
        this.dataService.showSnackBar('Vendor updated successfully');
        this.fetchPayRecordsbyComp();
      }
    })
  }

  navigateToVendorInvoice(vendor:any){
    const month = this.filters.selectedMonth.value;
    const year = this.filters.selectedYear.value;
    const vendorId = vendor.vendorId;
    this.router.navigate(['/vendor-invoice-details'], { queryParams: { month: month, year: year, vendorId: vendorId } });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);
      // Handle file upload logic here
    }
  }
  
}
