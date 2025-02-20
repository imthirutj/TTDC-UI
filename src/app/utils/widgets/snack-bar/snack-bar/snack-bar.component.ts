import { Component, Inject, HostBinding } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent {
  
  @HostBinding('class') snackBarClass: string;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; errorType: string },
    private snackBarRef: MatSnackBarRef<SnackBarComponent>
  ) {
    this.snackBarClass = this.getSnackBarClass(data.errorType);
  }

  closeSnackbar() {
    this.snackBarRef.dismiss();
  }

  private getSnackBarClass(errorType: string): string {
    switch (errorType) {
      case 'Warn':
        return 'snack-bar-warn';
      case 'Error':
        return 'snack-bar-error';
      default:
        return 'snack-bar-default';
    }
  }
}
