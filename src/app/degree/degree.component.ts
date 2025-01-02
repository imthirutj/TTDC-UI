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

    constructor(private masterDataService: MasterDataService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.getdegree(); 
      
      this.degree={

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
    
}


