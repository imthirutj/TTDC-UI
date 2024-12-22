import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  validate(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}user/Validate?skipSetAuth=true`, payload);
  }

}
