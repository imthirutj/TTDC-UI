import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  private user: any;
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService) {
 
  }


  fetchMedicalColleges(): Observable<any> {
    return this.http.get(`${this.apiUrl}master/medical-colleges?skipSetAuth=true`);
  }

  fetchIfpuData(): Observable<any> {
    return this.http.get(`${this.apiUrl}master/ifpu-data?skipSetAuth=true`);
  }

  fetchFsuData(): Observable<any> {
    return this.http.get(`${this.apiUrl}master/fsu-data?skipSetAuth=true`);
  }

  fetchSfuData(): Observable<any> {
    return this.http.get(`${this.apiUrl}master/sfu-data?skipSetAuth=true`);
  }

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}master/register?skipSetAuth=true`, formData);
  }
  
  


}
