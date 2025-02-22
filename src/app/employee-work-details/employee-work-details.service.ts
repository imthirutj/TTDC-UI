import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { UserService } from '../users/user.service';
import { DataService } from '../data.Service';
import { cu } from '@fullcalendar/core/internal-common';

@Injectable({
  providedIn: 'root'
})
export class EmployeeWorkDetailsService {


  private user: any;
   public apiUrl = environment.API_URL;
 
   constructor(private http: HttpClient,
     private router: Router,
     private userService: UserService,
     private  dataService:DataService
     ) {
  
   }
   getEmployeeWorkDetails(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Employee/GetEmployeeWorkDetails?${queryParams}`;
    return this.http.get(url);
  }
  
  updateEmployeeWorkDetails(payload: any): Observable<any> {
     const url = `${this.apiUrl}Employee/SaveEmployeeWorkDetails`;
    return this.http.post(url, payload);
  }
  
  getAttendanceDetails(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Attendance/GetBiometricDetails?${queryParams}`;
    return this.http.get(url);
  }

  getEmployeeBasedReports(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Reports/EmployeeBased?${queryParams}`;
    return this.http.get(url);
  }

}
