import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,  // Inject dynamic message
    private snackBarRef: MatSnackBarRef<SnackBarComponent>
  ) {}

  closeSnackbar() {
    this.snackBarRef.dismiss();
  }
}
