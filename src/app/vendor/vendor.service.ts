import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { UserService } from '../users/user.service';
import { DataService } from '../data.Service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {


  private user: any;
   private apiUrl = environment.API_URL;
 
   constructor(private http: HttpClient,
     private router: Router,
     private userService: UserService,
     private  dataService:DataService
     ) {
  
   }
   
   getPayRecordsbyComp(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Payroll/GetPayRecordsbyComp?${queryParams}`;
    return this.http.get(url);
  }

  updateVendorPayments(payload: any): Observable<any> {
    const url = `${this.apiUrl}Payroll/UpdateVendorPayments`;
    return this.http.post(url, payload);
  }

  generateVendeorInvoiceDetails(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Invoice/GenerateInvoice?${queryParams}`;
    return this.http.post(url,{});
  }

  viewVendorInvoiceDetails(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Invoice/ViewInvoiceAfterGeneration?${queryParams}`;
    return this.http.get(url);
  }
  preViewVendorInvoiceDetails(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Invoice/PreViewInvoice?${queryParams}`;
    return this.http.get(url);
  }

  updateVendor(payload: any): Observable<any> {
    const url = `${this.apiUrl}Master/InsertUpdateVendor`;
    return this.http.post(url, payload);
  }

  addVendor(payload: any): Observable<any> {
    const url = `${this.apiUrl}Master/InsertUpdateVendor`;
    return this.http.post(url, payload);
  }

  getVendorPayStatus(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Payroll/GetVendorPayStatus?${queryParams}`;
    return this.http.get(url);
  }

  downloadEmployeePaymentForm(payload: any) {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Payroll/GetAllEmployeeVendorPaySlip?${queryParams}`;
    window.open(url, '_blank');  // Opens the URL in a new tab
  }

  updateEmployeePayment(file: File, payload: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);  // Append the file to the form data

    const queryParams = this.dataService.buildQueryParams(payload);
 
  
    const url = `${this.apiUrl}Payroll/UploadEmployeeVendorPaySlip?${queryParams}`;

    return this.http.post(url, formData, {
      headers: new HttpHeaders()
    });
  }
  

  getVendorEmployeePaymentDetails(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}VendorPayment/GetVendorEmployeePayment?${queryParams}`;
    return this.http.get(url);
  }
}
