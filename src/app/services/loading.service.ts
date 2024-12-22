import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private activeRequests = 0;
  public isLoading = new BehaviorSubject<boolean>(false);
  public loadingMessage = new BehaviorSubject<string>('');

  constructor() {}

  setLoadingState(state: boolean, message: string = '') {
    if (state) {
      this.activeRequests++;
    } else {
      this.activeRequests = Math.max(0, this.activeRequests - 1);
    }

    this.isLoading.next(this.activeRequests > 0);
    this.loadingMessage.next(message);
  }

  clearLoadingState(delay: number = 0) {
    setTimeout(() => {
      this.activeRequests = 0;
      this.isLoading.next(false);
      this.loadingMessage.next('');
    }, delay);
  }

  setErrorState(error: any, message: string = 'An error occurred') {
    console.error(error);
    this.isLoading.next(false);
    this.loadingMessage.next(message);
  }
}
