import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environment/environment';
import { Router } from '@angular/router';
import { UserService } from './users/user.service';
import { UserType } from './common/user-type.enum';

@Injectable({
  providedIn: 'root',
})

export class DataService {

  private user: any;
  private apiUrl = environment.API_URL;


  
    genderTypes = ["Male", "Female", "Other", "Non-binary", "Prefer not to say"];
  
    // User types display name mapping
    userTypes = [
      { key: 'STATE_ADMIN', value: 'State Admin' },
      { key: 'DMER_ADMIN', value: 'DMER Admin' },
      { key: 'INSTITUTION_ADMIN', value: 'Institution Admin' },
      { key: 'IFPU', value: 'IFPU' },
      { key: 'FSU', value: 'FSU' },
      { key: 'SFU', value: 'SFU' },
    ];

    
  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService) {
    this.initializeUser();
  }

 

  public initializeUser(): void {
    this.user = JSON.parse(
      localStorage.getItem('user') || sessionStorage.getItem('user') || '{}'
    );
  }

  private getToken(): string | null {
    // Implement logic to get the token from local storage or cookies
    return (
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    );
  }

  public async setAuthTokenAndUser(
    token: string,
    user: any,
    rememberMe: boolean
  ): Promise<void> {
    await this.setUserAndToken(token, user, rememberMe);
  }

  private async setUserAndToken(
    token: string,
    user: any,
    rememberMe: boolean
  ): Promise<void> {
    // Remove the token from the user object
    delete user.token;
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      // Store token separately
    } else {
      sessionStorage.setItem('user', JSON.stringify(user)); // Store user without token
      sessionStorage.setItem('authToken', token); // Store token separately
    }
    this.initializeUser();
  }

  public removeToken(): void {
    // Clear all items from localStorage
    localStorage.clear();

    // Clear all items from sessionStorage
    sessionStorage.clear();

    // Reset user property
    this.user = null;
  }


  getUser(): any {
    return this.user;
  }



  logout() {
    // Implement logout logic and remove the token
    this.removeToken();
    this.user = null;
   // window.location.href='/login';
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}auth/validate_token`);
  }



  async getUserAccessLevel(): Promise<UserType | null> {
    // Ensure user is initialized before accessing
    await this.initializeUser(); // This ensures the user data is loaded

    // Return the user access level, or null if not available
    return this.user?.user_type || null;
  }


  getUserId(): string | null {
    return this.user?.userId || null;
  }

  // Add this method to retrieve medical_college_id
  getInstitutionId(): string | null {
    return this.user?.medical_college_id || null;
  }

  // Similarly, define methods for fetching IFPU, FSU, SFU data
}
