import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { DataService } from '../data.Service';

@Injectable({
  providedIn: 'root'
})
export class HolidayManagementServiceService {

  private user: any;
  private apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }


  getHolidays(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Master/holidays?${queryParams}`);
  }

  saveHoliday(payload:any):Observable<any>{
    return this.http.post(`${this.apiUrl}Master/SaveHoliday`,payload);
  }

  deleteHoliday(holidayId:any):Observable<any>{
    return this.http.post(`${this.apiUrl}Master/holidays/delete/${holidayId}`,{});
  }
  
}
