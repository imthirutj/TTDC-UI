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


  companyVendors: any ={};

  payRecords: any[] = [];

  isVendorModalOpen: boolean = false;
  isEmployeePaymentModelOpen: boolean = false;

  selectedVendor: any = {};

  vendorPayment: any = {};
  employeePayment: any = {};
  selectedFile: any;

  vendorDetails:any ={};

  pageAttributes = {
    currentPage: 1,
    totalPages: 1,
    pageSize:100
  }

  modalGenerateInv={
    show:false,
    title:'Generate Invoice',
    vendor:{},
    invoiceNo:''
  }

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
    public  dataService: DataService,
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
    this.pageAttributes.currentPage=1;
    this.search();
  }

  search() {
    this.fetchPayRecordsbyComp();
    this.pageAttributes.currentPage=1;
    this.fetchPayRecords();
  }


  ngOnInit(): void {
    this.fetchStates();
    this.search();
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
    if(!this.filters.companyId.value){
      this.dataService.showSnackBar('Please select Unit');
      return;
    }
    if(!this.filters.selectedMonth.value || !this.filters.selectedYear.value || !this.filters.vendorId.value){
      this.dataService.showSnackBar('Please select month/year/vendor');
      return;
    }
    const payload = this.dataService.getPayloadValue(this.filters);
    this.vendorService.getPayRecordsbyComp(payload).subscribe((response: any) => {
      if (response.success) {
        this.companyVendors = response.data[0];
        console.log('companyVendors:', this.companyVendors);
      }
      else {
        this.companyVendors = [];
      }
    })
  }

  fetchPayRecords(){
    if(!this.filters.companyId.value){
      this.dataService.showSnackBar('Please select Unit');
      return;
    }
    if(!this.filters.selectedMonth.value || !this.filters.selectedYear.value || !this.filters.vendorId.value){
      this.dataService.showSnackBar('Please select month/year/vendor');
      return;
    }
    const payload = this.dataService.getPayloadValue(this.filters);
    const fpayload={
      ...payload,
      ...this.pageAttributes
    }
    this.payRecords = [];
    this.masterDataService.getpayslipList(fpayload).subscribe((response: any) => {
      if (response.success) {
        this.payRecords = response.data.paidRecords;
         this.pageAttributes.totalPages = response.totalPages;
      }
      else {
        this.payRecords = [];
      }
    })
  }

  getTotal(field: string): number {
    return this.payRecords.reduce((sum, record) => {
      return sum + record.employees.reduce((empSum:any, employee:any) => empSum + (employee[field] || 0), 0);
    }, 0);
  }
  
  
  getTotalEmp(obj: any, key: string): number {
    return obj.employees.reduce((sum:any, emp:any) => sum + (emp[key] || 0), 0);
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
    if(!vendor.vendorId || !vendor.month || !vendor.year || !vendor.companyId){
      this.dataService.showSnackBar('Please select month/year/vendor/Company');
      return;
      
    }
    if (type === 'VIEW') {
      this.vendorPayment.title = 'View Vendor Payment Details - '+vendor.vendorName;
      this.vendorPayment.submit_disabled = true;
    }
    if (type === 'UPDATE') {
      this.vendorPayment.title = 'Update Vendor Payment Details - '+vendor.vendorName;
      this.vendorPayment.submit_disabled = false;
    }
    const payload = {
      vendorId: vendor.vendorId,
      month: vendor.month,
      year: vendor.year,
      compId: vendor.companyId
    }
    this.vendorService.getVendorPayStatus(payload).subscribe((response: any) => {
      if (response.success) {
        if(response.data){
          this.selectedVendor = response.data;
        }
        else{
          this.selectedVendor = vendor;
        }
      }
      else{
        this.selectedVendor = vendor;
      }
      this.getVendorById(vendor.vendorId);
    });
    
  }

  getVendorById(vendorId:any){
    const payload ={
      vendorId:vendorId
    }
    this.masterDataService.getVendors(payload).subscribe(
      (response:any)=>{
        if(response.success){
          this.vendorDetails = response.data[0];
        }
      }
    );
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
      month: vendor.month,
      year: vendor.year
    }
    this.vendorService.getVendorPayStatus(payload).subscribe((response: any) => {
      if (response.success) {
        if(response.data){
          this.selectedVendor = response.data;
        }
        else{
          this.selectedVendor = vendor;
        }
      }
      else{
        this.selectedVendor = vendor;
      }
    })

  }

  updateVendorModal() {
    var payload = {
      ...this.selectedVendor
    }
    this.vendorService.updateVendorPayments(this.selectedVendor).subscribe((response: any) => {
      if (response.success) {
        this.dataService.showSnackBar('Vendor updated successfully');
        this.search();
      }
    })
  }

  updateEmployeePayment() {
    const payload = {
      vendorId: this.selectedVendor.vendorId,
      month: this.selectedVendor.month,
      year: this.selectedVendor.year
    }
    if (this.selectedFile) {
      this.vendorService.updateEmployeePayment(this.selectedFile, payload)
        .subscribe(
          (response:any) => {
            this.dataService.showSnackBar(response);
            
          },
          error => {
            // Handle the error, e.g., show an error message
            this.dataService.showSnackBar(error.error.text);
          }
        );
    }

  }


  downloadEmployeePaymentForm() {
    const payload = {
      month: this.selectedVendor.month,
      year: this.selectedVendor.year,
      vendorId: this.selectedVendor.vendorId
    }
    this.vendorService.downloadEmployeePaymentForm(payload);
  }

  navigateVendorInvoice(vendor: any, type: 'VIEW' | 'PREVIEW') {
    if(!this.filters.companyId.value){
      this.dataService.showSnackBar('Please select Unit');
      return;
    }
    const month = vendor.month;
    const year = vendor.year;
    const vendorId = vendor.vendorId;
    this.router.navigate(['/vendor-invoice-details'],
       { queryParams: 
        { month: month, year: year, vendorId: vendorId, type: type, compId: this.filters.companyId.value } 
      });
  }

  openGenerateInvoiceModal(vendor:any){
    if(!this.filters.companyId.value){
      this.dataService.showSnackBar('Please select Unit');
      return;
    }
    this.modalGenerateInv.show=true;
    this.modalGenerateInv.vendor=vendor;
    this.modalGenerateInv.invoiceNo='';
  }

  closeGenerateInvoiceModal(){
    this.modalGenerateInv.show=false;
    this.modalGenerateInv.vendor={};
    this.modalGenerateInv.invoiceNo='';
  }


  generateInvoice() {
    if(!this.filters.companyId.value){
      this.dataService.showSnackBar('Please select Unit');
      return;
    }

    var invoiceNo = this.modalGenerateInv.invoiceNo;
    var payload={
      month: this.filters.selectedMonth.value,
      year: this.filters.selectedYear.value,
      vendorId: this.filters.vendorId.value,
      invoiceNo: invoiceNo,
      compId: this.filters.companyId.value
    }
    this.vendorService.generateVendeorInvoiceDetails(payload).subscribe((response) => {
      console.log('Vendor Invoice Details:', response);
      this.dataService.openConfirmationDialog(response.message);

      if(response.success){
        this.navigateVendorInvoice( this.modalGenerateInv.vendor, 'VIEW');
      }
      
    });
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


 

}
