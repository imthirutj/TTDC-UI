import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate,
} from '@angular/router';
import { DataService } from './data.Service';
import { map, catchError, switchMap } from 'rxjs/operators'; // Import necessary operators
import { Observable, of, from } from 'rxjs'; // Import Observable and from

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isAuthenticated: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRoles = route.data['roles'] as Array<string>;

    return this.dataService.isLoggedIn().pipe(
      switchMap((result) => {
        this.isAuthenticated = result.success;

        if (this.isAuthenticated) {
          // Convert Promise to Observable
          return from(this.dataService.getUserAccessLevel()).pipe(
            map((userAccessLevel) => {
              // If no roles are required, just check if the user is logged in
              if (!requiredRoles || requiredRoles.length === 0) {
                return true;
              }

              // Check if the user's role is one of the required roles or 'ALL' Roles
              if (requiredRoles.includes('ALL') || requiredRoles.includes(userAccessLevel!)) {
                return true; // Allow access
              } else {
                this.router.navigate(['/login']); // Redirect to login if access is denied
                return false; // Deny access
              }
            }),
            catchError((error) => {
              console.error('Error getting user access level:', error);
              this.dataService.logout(); // Example: Logout on error
              this.router.navigate(['/login']); // Redirect to login on error
              return of(false); // Return false to block access to the route
            })
          );
        } else {
          this.dataService.logout();
          this.router.navigate(['/login']); // Redirect to login if not authenticated
          return of(false); // Block access to the route
        }
      }),
      catchError((error) => {
        console.error('Error in AuthGuard:', error);
        this.dataService.logout(); // Example: Logout on error
        this.router.navigate(['/login']); // Redirect to login on error
        return of(false); // Return false to block access to the route
      })
    );
  }
}