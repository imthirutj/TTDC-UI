import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
 Department: any[] = []; 

  constructor(private masterDataService: MasterDataService) {}
  ngOnInit(): void {
    this.getDepartmentList(); 
  }
  getDepartmentList(): void {
    this.masterDataService.getEmployeeList('').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Department = response.data; 
          
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
