import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  errorCode: string | null = '';
  errorMessage: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get error code and message from route parameters or query parameters
    this.route.queryParams.subscribe(params => {
      this.errorCode = params['errorCode'] || 'Unknown Error';
      this.errorMessage = params['message'] || 'You do not have the necessary access to view this page.';
    });
  }
}
