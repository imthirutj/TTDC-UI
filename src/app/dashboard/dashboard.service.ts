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
export class DashboardService {

  private user: any;
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private dataService: DataService
  ) {

  }

  getDashboardData(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
   // return this.http.get(`assets/mock/dashboard.json?${queryParams}`);
    return this.http.get(`${this.apiUrl}Dashboard/GetNewDashboardCount?${queryParams}`);
  }

  getPaymentGeneratedList(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    //return this.http.get(`assets/mock/dashboard-list.json?${queryParams}`);
    return this.http.get(`${this.apiUrl}Dashboard/GetPayDetails?${queryParams}`);
  }

  getColumnWiseTableReport(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Dashboard/GetColumnWiseTableReport?${queryParams}`);
  }


  getExpQualMismatchCount(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Dashboard/GetExpQualMismatchCount?${queryParams}`);
  }

  getLoggedInCounts(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Dashboard/GetPresentAbsentCount?${queryParams}`);
  }

  getMonthlyPresentAbsentCount(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Dashboard/GetMonthlyPresentAbsentCount?${queryParams}`);
  }


  //Dashboard/GetDashboardReportCount
  getDashboardReportCount(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Dashboard/GetDashboardReportCount?${queryParams}`);
  }

  getEmployeeLineListReports(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Dashboard/GetDashboardReportList?${queryParams}`);
  }
  
}
