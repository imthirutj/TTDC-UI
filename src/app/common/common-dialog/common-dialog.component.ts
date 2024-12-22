import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})

export class CommonDialogComponent {
  
  @Input() showDialog: boolean = false;
  @Input() dialogTitle: string = '';
  @Input() showClearButton: boolean = false;
  @Input() showSubmitButton: boolean = false;
  @Input() showCloseIcon: boolean = false;
  @Input() showCustomButton: boolean = false; // To control the visibility of the custom button
  @Input() customButtonName: string = ''; // To set the name for the custom button
  @Output() closeDialog = new EventEmitter<void>();
  @Output() submitDialog = new EventEmitter<void>();
  @Output() customButton = new EventEmitter<void>(); // Emit when custom button is clicked
  
  onClose() {
    this.closeDialog.emit();
  }

  onSubmit() {
    this.submitDialog.emit();
  }

  onCustomButtonClick() {
    this.customButton.emit();
  }
}