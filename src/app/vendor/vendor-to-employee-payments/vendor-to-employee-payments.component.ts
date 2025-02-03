import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MasterDataService } from '../../services/master-data.service';
import { DataService } from '../../data.Service';
import { UserType } from '../../common/user-type.enum';
import { myMonths, myYears } from '../../utils/helpers/variables';
import { VendorService } from '../vendor.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vendor-to-employee-payments',
  templateUrl: './vendor-to-employee-payments.component.html',
  styleUrls: ['./vendor-to-employee-payments.component.css']
})
export class VendorToEmployeePaymentsComponent {

  
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



  vendorEmployeePayments: any[] = [];
 
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
    this.fetchVendorEmployeePaymentDetails();

  }

  search() {
    this.fetchVendorEmployeePaymentDetails();
  }


  ngOnInit(): void {
  }

  fetchVendorEmployeePaymentDetails(){
    const payload = this.dataService.getPayloadValue(this.filters);
    this.vendorService.getVendorEmployeePaymentDetails(payload).subscribe((response: any) => {
      if (response.success) {
        this.vendorEmployeePayments = response.data.map((vep: any) => ({
          ...vep,
          difference: vep.netSalary - vep.paidToEmployee
        }));
      }
      else {
        this.vendorEmployeePayments = [];
      }
    })
  }

  getTotal(field: string): number {
    return this.vendorEmployeePayments.reduce((sum, record) => sum + (record[field] || 0), 0);
  }
  

}
