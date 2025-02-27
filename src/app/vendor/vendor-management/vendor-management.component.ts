import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { VendorService } from '../vendor.service';
import { DataService } from 'src/app/data.Service';
import { ActivatedRoute, Router } from '@angular/router';
import { Vendor } from 'src/app/utils/interface/vendor';
import { City, Company, Department } from 'src/app/utils/interface/masters';
import { UserType } from 'src/app/common/user-type.enum';

@Component({
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.css']
})
export class VendorManagementComponent {

  UserType = UserType;
  userAccessLevel: any;
  user: any;


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
    designationId: {
      value: '',
      show: true,
      key: 'designationId',
      includeInSearchParams: true
    },
    vendorId: {
      value: '',
      show: false,
      key: 'vendorId',
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
    companyList: [],
    departmentList: [],
    comp: { id: 0, name: '' },
    dept: { id: 0, name: '' },
  };

  dropdowns = {
    companies: [] as Company[],
    departments: [] as Department[],
    cities: [] as City[]
  };



  constructor(private masterDataService: MasterDataService,
    private vendorService: VendorService,
    private router: Router,
    public dataService: DataService,
    private route: ActivatedRoute)  {
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);


    });
  }

  ngAfterViewInit() {
    this.fetchCities();
    this.fetchDepartments();
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.route.queryParams.subscribe(params => {
      if (params['passedFilter'] == '1') {
        this.dataService.applyFilter(this.filters).then(() => {
          this.search();
        });
      } else {
        this.search();
      }
    });
  }
  search() {
    this.getVendors();
  }


  //#region Dropdowns
  onCityChange() {
    //this.modal.vendor.companyId = '';
    this.fetchCompanies(this.modal.vendor.cityId);
  }
  onCompanyChange() {

  }

  onDepartmentChange() {

  }

  addCompanyDepartment() {
    // if (!this.modal.comp.id || !this.modal.dept.id) {
    //   this.dataService.showSnackBar('Please select Unit and department');
    //   return;
    // }

    // // Check if the companyId and departmentId already exist in the companyDepartmentList
    // const existingEntry = this.modal.vendor.companyDepartmentList.find(
    //   item => item.companyId == this.modal.comp.id && item.departmentId == this.modal.dept.id
    // );

    // if (existingEntry) {
    //   // If a match is found, show an error message
    //   this.dataService.showSnackBar('This company and department combination already exists');
    //   return;
    // }

    // // If no match is found, create the new data object
    // const data = {
    //   companyId: this.modal.comp.id,
    //   companyName: this.getCompanyNameById(this.modal.comp.id),
    //   departmentId: this.modal.dept.id,
    //   departmentName: this.getDeptNameById(this.modal.dept.id)
    // };

    // // Add the new data to the companyDepartmentList
    // this.modal.vendor.companyDepartmentList.push(data);
  }

  deleteCompanyDepartment(companyId: number, departmentId: number) {
    // // Filter out the company-department combination from the list
    // this.modal.vendor.companyDepartmentList = this.modal.vendor.companyDepartmentList.filter(
    //   item => !(item.companyId === companyId && item.departmentId === departmentId)
    // );
  }

  getCompanyNameById(companyId: any): string {
    const company = this.dropdowns.companies.find(c => c.companyId == companyId);
    return company ? company.companyFName : '';
  }


  getDeptNameById(deptId: any): string {
    const dept = this.dropdowns.departments.find(d => d.departmentId == deptId);
    return dept ? dept.departmentFName : '';
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

 
  getVendors() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getVendors(payload).subscribe((response) => {
      if (response.success) {
        this.vendors = response.data as Vendor[];
      };
    });
  }


  //#region Modal

  // Method to add a new row
  addMobileField() {
    this.modal.vendor.vendorMobileNumbers.push({ role: '', mobile: '' });
  }

  // Method to remove a row
  removeMobileField(index: number) {
    this.modal.vendor.vendorMobileNumbers.splice(index, 1);
  }

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
    }
    this.modal.title = isEdit ? 'Edit Vendor' : 'Add Vendor';
  }

  closeModal() {
    this.modal.show = false;
    this.modal.vendor = new Vendor();
    this.getVendors();
  }
  updateVendorModal() {
    if (this.modal.isEdit) {
      this.vendorService.updateVendor(this.modal.vendor).subscribe((response) => {
        if (response.success) {
          this.dataService.showSnackBar('Vendor updated successfully');
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
