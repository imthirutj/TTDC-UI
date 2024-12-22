import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-state',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  states: any[] = []; // Array to store state list

  constructor(private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.getStateList(); // Fetch the state list when the component initializes
  }

  // Method to fetch the list of states
  getStateList(): void {
    this.masterDataService.getStates().subscribe(
      (response: any) => {
        if (response.success) {
          this.states = response.data; // Assume response.data contains the list of states
        } else {
          alert(response.message || 'Failed to fetch state list.');
        }
      },
      (error) => {
        console.error('Error fetching state list:', error);
        alert('An error occurred while fetching the state list.');
      }
    );
  }
}
