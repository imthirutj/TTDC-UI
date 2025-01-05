import { HttpClient } from '@angular/common/http';
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
    const url = `${this.apiUrl}Invoice/ViewInvoice?${queryParams}`;
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
}
