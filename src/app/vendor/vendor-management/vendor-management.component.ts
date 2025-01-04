import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { VendorService } from '../vendor.service';
import { DataService } from 'src/app/data.Service';
import { Router } from '@angular/router';

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
      includeInSearchParams:true
    },
    companyId: {
      value: '',
      show: true,
      key: 'compId',
      includeInSearchParams:true
    },
    deptId: {
      value: '',
      show: true,
      key: 'deptId',
      includeInSearchParams:true
    },
    vendorName:{
      value: '',
      show: true,
      key: 'vendorName',
      includeInSearchParams:true
    }
   
  };

  vendors: {
    vendorId: number;
    vendorName: string;
    gstin: string;
    panNo: string;
    address: string;
    contactNo: string;
    emailId: string;
    companyFName: string;
    companySName: string;
    cityId: number;
    cityName: string;
    departmentId: number;
    departmentFName: string;
    departmentSName: string;
    
  }[] = [];

  constructor(private masterDataService: MasterDataService,
    private vendorService: VendorService,
    private router: Router,
    private dataService: DataService
  ) { 

  }

  ngOnInit() {
    
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getVendors();
  }
  search(){
    this.getVendors();
  }
  getVendors() {
    const payload  = this.dataService.getPayloadValue(this.filters);
   this.masterDataService.getVendors(payload).subscribe((response) => {
     if (response.success) {
      this.vendors = response.data as any[];
     };
   });
  }


  openVendorModal(vendor: any){

  }
}
