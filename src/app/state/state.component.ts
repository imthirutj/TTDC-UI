import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  stateForm: FormGroup = new FormGroup({});// Define the FormGroup

  constructor(
    private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Properly initialize the FormGroup
    this.stateForm = this.fb.group({
      stateName: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  // Method to handle state insert or update
  submitState(): void {
    if (!this.stateForm) {
      console.error('Form not initialized.');
      return;
    }

    if (this.stateForm.invalid) {
      alert('Please provide a valid state name.');
      return;
    }

    const stateName = this.stateForm.get('stateName')?.value;

    // API call to insert or update the state
    this.masterDataService.insertUpdateState({ stateName }).subscribe(
      (response: any) => {
        if (response.success) {
          alert('State successfully inserted/updated!');
          this.stateForm.reset(); // Clear the form after success
        } else {
          alert(response.message || 'Failed to insert/update state.');
        }
      }
    );
  }
}
