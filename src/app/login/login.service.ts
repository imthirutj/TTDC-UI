import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { DataService } from '../data.Service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient, private dataService: DataService) { }

  validate(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.post(`${this.apiUrl}Login/ValidateUser?${queryParams}&skipSetAuth=true`, {});
  }

  generateOTP(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.post(`${this.apiUrl}Login/GenerateOTP?${queryParams}&skipSetAuth=true`,{});
  }

}
