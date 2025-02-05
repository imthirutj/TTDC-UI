import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidayManagementServiceService {

  private user: any;
  private apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }


  getHolidays(payload:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/holidays`);
  }

  saveHoliday(payload:any):Observable<any>{
    return this.http.post(`${this.apiUrl}Master/SaveHoliday`,payload);
  }
  
}
