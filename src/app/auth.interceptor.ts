import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';
import { HelperService } from './utils/helpers/helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from './data.Service';
import { SnackBarComponent } from './utils/widgets/snack-bar/snack-bar/snack-bar.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService,
     private helperService: HelperService,
     private snackBar: MatSnackBar,
     private dataService:DataService
    ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loading spinner
    this.loadingService.setLoadingState(true);

    const skipAuth = this.helperService.getQueryParam(req.urlWithParams, 'skipSetAuth') === 'true';

    // Add Content-Type for all requests
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (req.body instanceof FormData) {
      // Skip setting Content-Type for FormData as the browser sets it automatically
      headers = headers.delete('Content-Type');
    }

    if (skipAuth) {
      console.log('Bypassing auth for URL:', req.url);

      // Clone the request with the necessary headers
      const modifiedReq = req.clone({ headers });

      return next.handle(modifiedReq).pipe(
        finalize(() => {
          this.loadingService.setLoadingState(false);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
          return throwError(error);
        })
      );
    }

    // Add Authorization header if auth is not skipped
    const authToken =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    } else {
      console.warn('No auth token found, making request without Authorization header');
    }

  //   console.log('Request Headers:', headers.keys(), headers.get('Authorization'));

    // Clone the request with the necessary headers
    const authReq = req.clone({ headers });

    return next.handle(authReq).pipe(
      finalize(() => {
        this.loadingService.setLoadingState(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(error);
      }),
      tap((event: HttpEvent<any>) => {
        // Only process the response body if the response is a successful 200
        if (event instanceof HttpResponse) {
          const responseBody = event.body;
          if (responseBody && responseBody.success === false) {
            this.dataService.showSnackBar(responseBody.message);
            console.log('Error message from response:', responseBody.message || 'Unknown error');
          }
        }
      })
    );
  }


   // Handle HTTP error and print status code and error response
   private handleError(error: HttpErrorResponse): void {
    if (error.status !== 200) {
      this.snackBar.openFromComponent(SnackBarComponent, {
        data: { message: 'Error Occured While Processing...' },  // Pass dynamic message
        duration: 5000
      });
    }
  }
}
