import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent implements OnInit {
  Department: any[] = []; 

  constructor(private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.getDepartmentList(); 
  }

  getDepartmentList(): void {
    this.masterDataService.getDepartment().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Department = response.data; 
          console.log('Department list:', this.Department);
        } else {
          alert(response.message || 'Failed to fetch Department list.');
        }
      },
      (error) => {
        console.error('Error fetching Department list:', error);
        alert('An error occurred while fetching the Department list.');
      }
    );
  }
}  


