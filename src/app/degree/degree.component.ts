import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.css']
})

export class DegreeComponent {
  degreelist: any[] = [];
  degree: any;

  constructor(private masterDataService: MasterDataService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.getdegree();

    this.degree = {

      degree_Name: ''

    }

  }
  getdegree(): void {
    // const query = '?comp_id=33'; 
    this.masterDataService.getdegree('').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.degreelist = response.data;
          console.log('od company list:', this.degreelist);
        } else {
          alert(response.message || 'Failed to fetch od company list.');
        }
      },
      (error) => {
        console.error('Error fetching OD company list:', error);
        alert('An error occurred while fetching the OD company list.');
      }
    );
  }



  savedegree(degree: any): void {
    console.log(degree)
    // if (!this.employeeForm) {
    //   console.error('Form not initialized.');
    //   return;
    // }

    this.masterDataService.savedegree(degree).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          alert('degree updated successfully.');
          this.getdegree();
          location.reload(); // Refresh the list
        } else {
          alert(response.message || 'Failed to update degree.');
        }
      },
      (error: any) => {
        console.error('Error updating degree:', error);
        alert('An error occurred while updating the degree.');
      }
    );
  }




  // Variables to keep track of sort state
  sortBy: string = 'date';  // Default sorting by 'date'
  sortOrder: string = 'asc'; // Default ascending order
  // Sort the data based on column name and order
  sortData(column: string): void {
    // Toggle sorting order if the same column is clicked
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc'; // Reset to ascending when changing column
    }

    // Perform sorting based on the selected column and order
    this.degreelist.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      // Handle case for dates (sort Date objects)
      if (column === 'date') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) {
        return this.sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }


}


