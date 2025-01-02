import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-designation-qualification',
  templateUrl: './designation-qualification.component.html',
  styleUrls: ['./designation-qualification.component.css']
})


export class DesignationQualificationComponent {
  Designation_Qualification_list: any[] = []; 
  Designation_Qualification: any;

  Designation: any[] = []; 
  degreelist: any[] = []; 

    constructor(private masterDataService: MasterDataService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.get_Designation_Qualification(); 
      this.getDesignationList();
      this.getdegree(); 
      
      this.Designation_Qualification={

        designationId: '',
        degree_Id: '',       
       
      }
      
    }
    get_Designation_Qualification(): void {
      // const query = '?comp_id=33'; 
      this.masterDataService.get_Designation_Qualification('').subscribe(
        (response: any) => {
          console.log('API Response:', response);
          if (response.success && Array.isArray(response.data)) {
            this.Designation_Qualification_list = response.data; 
            console.log('od company list:', this.Designation_Qualification_list);
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

    getDesignationList(): void {
      this.masterDataService.getDesignation().subscribe((response: any) => {
        if (response?.success && Array.isArray(response.data)) {
          this.Designation = response.data;
        } else {
          alert(response?.message || 'Failed to fetch Designation list.');
        }
      });
    } 

    save_Designation_Qualification(Designation_Qualification: any): void {
      console.log(Designation_Qualification)
        // if (!this.employeeForm) {
        //   console.error('Form not initialized.');
        //   return;
        // }
      
        this.masterDataService.save_Designation_Qualification(Designation_Qualification).subscribe(
          (response: any) => {
            console.log('API Response:', response);
            if (response.success) {
              alert('Designation Qualification updated successfully.');
              this.get_Designation_Qualification();
              location.reload(); // Refresh the list
            } else {
              alert(response.message || 'Failed to update Designation Qualification.');
            }
          },
          (error: any) => {
            console.error('Error updating Designation_Qualification:', error);
            alert('An error occurred while updating the Designation_Qualification.');
          }
        );
      }
    
}



