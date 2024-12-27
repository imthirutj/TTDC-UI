import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';
import { myMonths, myYears } from '../utils/helpers/variables';

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

  // Selected month and year for the calendar
  selectedMonth: number = new Date().getMonth(); // Default to current month
  selectedYear: number = new Date().getFullYear(); // Default to current year

  months = myMonths;
   years = myYears;
 

  companyVendors: any;
  constructor(

    private masterDataService: MasterDataService,
    private dataSerivce: DataService
  ) {
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = new Date().getFullYear();
    this.dataSerivce.getUser().subscribe((user) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);

      this.companyVendors = [
        {
          vendorId: 0,
          companyId: 14,
          companyName: "MADURAI 2 - TTDC HOTEL TAMILNADU",
          totalPayableAmount: 25175,
          gst: 4531,
          serviceCharge: 503,
          tds: 503,
          netAmount: 29706
        },
        {
          vendorId: 0,
          companyId: 13,
          companyName: "MADURAI 1 - TTDC HOTEL TAMILNADU",
          totalPayableAmount: 50350,
          gst: 9063,
          serviceCharge: 1007,
          tds: 1007,
          netAmount: 59413
        }
      ];

    });
  }


  ngOnInit(): void {
    this.fetchStates();
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

}
