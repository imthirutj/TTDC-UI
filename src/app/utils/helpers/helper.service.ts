import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() {}

  // Function to extract query parameters from the URL
  getQueryParam(url: string, param: string): string | null {
    const urlObj = new URL(url, window.location.origin);  // Use window.location.origin for base URL
    return urlObj.searchParams.get(param);
  }
  
}
