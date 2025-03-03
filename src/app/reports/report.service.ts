import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { DataService } from '../data.Service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private user: any;
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private dataService: DataService
  ) {

  }

  getDesignationWiseReport(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Report/GetDesignationWiseCount?${queryParams}`);
  }

  getDeptWiseReport(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Report/GetSectionWiseCount?${queryParams}`);
  }

  getUnitWiseReport(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Report/GetUnitWiseCount?${queryParams}`);
  }
  getVendorWiseReport(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Report/GetVendorWiseReport?${queryParams}`);
  }

  getRegionWiseCount(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Report/GetRegionWiseCount?${queryParams}`);
  }

  getLoggedNotLoggedRep(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Report/GetUnitWiseLogCount?${queryParams}`);
  }

  // Report/GetCompanyWiseEmpQualfList
  getCompanyWiseEmpQualfList(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Report/GetCompanyWiseEmpQualfList?${queryParams}`);
  }
}
