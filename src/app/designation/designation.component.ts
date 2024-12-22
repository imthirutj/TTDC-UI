import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css']
})

export class DesignationComponent implements OnInit {
  Designation: any[] = []; 

  constructor(private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.getDesignationList(); 
  }

  getDesignationList(): void {
    this.masterDataService.getDesignation().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Designation = response.data; 
          console.log('Designation list:', this.Designation);
        } else {
          alert(response.message || 'Failed to fetch Designation list.');
        }
      },
      (error) => {
        console.error('Error fetching Designation list:', error);
        alert('An error occurred while fetching the Designation list.');
      }
    );
  }
}  


