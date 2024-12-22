import { Injectable } from '@angular/core';
import { UserService } from '../users/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  private user: any;
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService) {
 
  }

  
  fetchMedicalCollegeDetails(institution_id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}institution/details/${institution_id}`);
  }

}
