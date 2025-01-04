import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { VendorService } from '../vendor.service';
import { DataService } from 'src/app/data.Service';
import { Router } from '@angular/router';
import { Vendor } from 'src/app/utils/interface/vendor';
import { City, Company, Department } from 'src/app/utils/interface/masters';

@Component({
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.css']
})
export class VendorManagementComponent {


  filters: any = {
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
    vendorName: {
      value: '',
      show: true,
      key: 'vendorName',
      includeInSearchParams: true
    }

  };

  vendors: Vendor[] = [];

  modal = {
    show: false,
    isEdit: false,
    title: '',
    vendor: new Vendor(),
  };

  dropdowns = {
    companies: [] as Company[],
    departments: [] as Department[],
    cities: [] as City[]
  };
  
  

  constructor(private masterDataService: MasterDataService,
    private vendorService: VendorService,
    private router: Router,
    private dataService: DataService
  ) {

  }

  ngAfterViewInit() {
    this.fetchCities();
    this.fetchDepartments();
  }


  //#region Dropdowns
  onCityChange() {
    this.modal.vendor.companyId = '';
    this.fetchCompanies(this.modal.vendor.cityId);
  }
  onCompanyChange(){

  }

  //#endregion

  //#region Fetch
  fetchCities() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getCity(payload).subscribe((response) => {
      if (response.success) this.dropdowns.cities = response.data;
    });
  }

  fetchCompanies(cityId: any) {
    const payload = { 
      cityId: cityId,
    };
    this.masterDataService.getCompany(payload).subscribe((response) => {
      if (response.success) this.dropdowns.companies = response.data;
    });
  }

  fetchDepartments() {
    this.masterDataService.getDepartment().subscribe((response) => {
      if (response.success) this.dropdowns.departments = response.data;
    });
  }
  //#endregion

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getVendors();
  }
  search() {
    this.getVendors();
  }
  getVendors() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getVendors(payload).subscribe((response) => {
      if (response.success) {
        this.vendors = response.data as Vendor[];
      };
    });
  }


  //#region Modal
  openVendorModal(isEdit: boolean = false, vendor: any) {
    this.modal.show = true;
    this.modal.isEdit = isEdit;
    this.dropdowns.companies = [];

    if (isEdit) {
      this.modal.vendor = new Vendor(vendor);
      this.fetchCompanies(this.modal.vendor.cityId);
    }
    else {
      this.modal.vendor.cityId = this.filters.cityId.value;
      this.modal.vendor.companyId = this.filters.companyId.value;
      this.modal.vendor.departmentId = this.filters.deptId.value;
    }
    this.modal.title = isEdit ? 'Edit Vendor' : 'Add Vendor';
  }

  closeModal() {
    this.modal.show = false;
    this.modal.vendor = new Vendor();
  }
  updateVendorModal() {
    if (this.modal.isEdit) {
      this.vendorService.updateVendor(this.modal.vendor).subscribe((response) => {
        if (response.success) {
          this.getVendors();
        }
      });
    }
    else {
      this.vendorService.addVendor(this.modal.vendor).subscribe((response) => {
        if (response.success) {
          this.getVendors();
        }
      });
    }
    this.modal.show = false;
  }
  //#endregion
}
