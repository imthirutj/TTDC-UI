import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MasterDataService } from '../../services/master-data.service';
import { DataService } from '../../data.Service';
import { UserType } from '../../common/user-type.enum';
import { myMonths, myYears } from '../../utils/helpers/variables';
import { VendorService } from '../vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-payment-details',
  templateUrl: './vendor-payment-details.component.html',
  styleUrls: ['./vendor-payment-details.component.css']
})
export class VendorPaymentDetailsComponent implements OnInit {

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
  isEmployeePaymentModelOpen: boolean = false;

  selectedVendor: any = {};

  vendorPayment: any = {};
  employeePayment: any = {};
  selectedFile: any;

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

    cityId: {
      value: '',
      show: true,
      key: 'cityId',
      includeInSearchParams: true
    },
    companyId: {
      value: '',
      show: true,
      key: 'compId',
      includeInSearchParams: true
    },
    deptId: {
      value: '',
      show: true,
      key: 'deptId',
      includeInSearchParams: true
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
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);

    });
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.fetchPayRecordsbyComp();
  }

  search() {
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

  fetchPayRecordsbyComp() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.vendorService.getPayRecordsbyComp(payload).subscribe((response: any) => {
      if (response.success) {
        this.companyVendors = response.data;
      }
      else {
        this.companyVendors = [];
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

  openVendorModal(type: 'VIEW' | 'UPDATE', vendor: any) {
    this.isVendorModalOpen = true;

    if (type === 'VIEW') {
      this.vendorPayment.title = 'View Vendor Payment Details';
      this.vendorPayment.submit_disabled = true;
    }
    if (type === 'UPDATE') {
      this.vendorPayment.title = 'Update Vendor Payment Details';
      this.vendorPayment.submit_disabled = false;
    }
    const payload = {
      vendorId: vendor.vendorId,
      month: this.filters.selectedMonth.value,
      year: this.filters.selectedYear.value
    }
    this.vendorService.getVendorPayStatus(payload).subscribe((response: any) => {
      if (response.success) {
        this.selectedVendor = response.data;
      }
    })
    this.selectedVendor = vendor;
  }

  openEmployeePaymentModal(type: 'VIEW' | 'UPDATE', vendor: any) {
    this.isEmployeePaymentModelOpen = true;
    if (type === 'VIEW') {
      this.employeePayment.title = 'View Employee Payment Details';
      this.employeePayment.submit_disabled = true;
    }
    if (type === 'UPDATE') {
      this.employeePayment.title = 'Update Employee Payment Details';
      this.employeePayment.submit_disabled = true;
    }
    const payload = {
      vendorId: vendor.vendorId,
      month: this.filters.selectedMonth.value,
      year: this.filters.selectedYear.value
    }
    this.vendorService.getVendorPayStatus(payload).subscribe((response: any) => {
      if (response.success) {
        this.selectedVendor = response.data;
      }
    })
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

  updateEmployeePayment() {
    const payload = {
      month: this.filters.selectedMonth.value,
      year: this.filters.selectedYear.value,
      vendorId: this.selectedVendor.vendorId
    }
    if (this.selectedFile) {
      this.vendorService.updateEmployeePayment(this.selectedFile, payload)
        .subscribe(
          response => {
            // Handle the response, e.g., show a success message
            this.dataService.showSnackBar('File uploaded successfully');
          },
          error => {
            // Handle the error, e.g., show an error message
            this.dataService.showSnackBar('Error uploading file');
          }
        );
    }

  }


  downloadEmployeePaymentForm() {
    const payload = {
      month: this.filters.selectedMonth.value,
      year: this.filters.selectedYear.value,
      vendorId: this.selectedVendor.vendorId
    }
    this.vendorService.downloadEmployeePaymentForm(payload);
  }

  navigateVendorInvoice(vendor: any, type: 'VIEW' | 'GENERATE') {
    const month = this.filters.selectedMonth.value;
    const year = this.filters.selectedYear.value;
    const vendorId = vendor.vendorId;
    this.router.navigate(['/vendor-invoice-details'], { queryParams: { month: month, year: year, vendorId: vendorId, type: type } });
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }



}
