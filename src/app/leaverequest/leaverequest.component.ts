import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-leaverequest',
  templateUrl: './leaverequest.component.html',
  styleUrls: ['./leaverequest.component.css']
})


export class LeaverequestComponent {
  leaverequstlist: any[] = [];   
  leaverequset: any;

    constructor(private masterDataService: MasterDataService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.getLeaveRequest(); 
    
      this.leaverequset={
        employeeId: 0,
        purpose: '',
        from_Date: '',
        to_Date: '',
        how_Many_Days: '',
       
      }
      
    }
    getLeaveRequest(): void {
      const query = '?emp_id=3846'; // Build the query string
      this.masterDataService.getLeaveRequest(query).subscribe(
        (response: any) => {
          console.log('API Response:', response);
          if (response.success && Array.isArray(response.data)) {
            this.leaverequstlist = response.data; 
            console.log('od company list:', this.leaverequstlist);
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

   
    saveleaverequset(leaverequset: any): void {
      console.log(leaverequset)
        // if (!this.employeeForm) {
        //   console.error('Form not initialized.');
        //   return;
        // }
      
        this.masterDataService.saveLeaveRequest(leaverequset).subscribe(
          (response: any) => {
            console.log('API Response:', response);
            if (response.success) {
              alert('leave requset updated successfully.');
              this.getLeaveRequest(); // Refresh the list
            } else {
              alert(response.message || 'Failed to update leave requset.');
            }
          },
          (error: any) => {
            console.error('Error updating leave requset:', error);
            alert('An error occurred while updating the leave requset.');
          }
        );
      }
    
}


