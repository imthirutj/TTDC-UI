import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: any;
  private apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }


  getUserDetails(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}user/details/${userId}`);
  }


}