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
export class PfUpdateService {


  private user: any;
  public apiUrl = environment.API_URL;

  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private dataService: DataService
  ) {

  }


  //getPfNotCreditedCount
  getPfNotCreditedCount(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Employment/CountEmpWithoutPfCredited?${queryParams}`;
    return this.http.get(url);
  }
  //getpfLogReport
  getPfLogReport(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Employment/LogReport?${queryParams}`;
    return this.http.get(url);
  }

  //bulkUpdatePf
  bulkUpdatePf(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Employment/BulkUpdateEmployeePfPassbook?${queryParams}`;
    return this.http.post(url, {});
  }

  cancelBulkUpdate(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Employment/CancelBulkUpdate?${queryParams}`;
    return this.http.post(url, {});
  }
}
