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
 
   getEmployeeWorkReoportDetails(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`assets/mock/employee-work-details.json?${queryParams}`);
   }

}
