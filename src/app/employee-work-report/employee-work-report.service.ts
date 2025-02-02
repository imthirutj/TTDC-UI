import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { DataService } from '../data.Service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeWorkReportService {

  private user: any;
   private apiUrl = environment.API_URL;
 
   constructor(private http: HttpClient,
     private router: Router,
     private userService: UserService,
     private  dataService:DataService
     ) {
  
   }
 
   getEmployeeWorkReportDetails(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    //const url = `assets/mock/employee-work-details.json`;
    const url = `${this.apiUrl}EmpWorkReport/GetEmployeeAttendanceReport?${queryParams}`;
     return this.http.get(url);
   }

   updateAttendance(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}EmpWorkReport/UpsertEmployeeAttendance`, payload);
   }

   getBiometricLogs(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}EmpWorkReport/GetBiometricLogs?${queryParams}&skipLoader=true`;
    return this.http.get<any>(url);
  }

  getAvailableCompensatedDates(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}EmpWorkReport/GetAvailableCompensatedDates?${queryParams}`;
    return this.http.get<any>(url);
  }
  

}
