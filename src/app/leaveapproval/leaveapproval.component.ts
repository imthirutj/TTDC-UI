import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-leaveapproval',
  templateUrl: './leaveapproval.component.html',
  styleUrls: ['./leaveapproval.component.css']
})

export class LeaveapprovalComponent {
  leaverequstlist: any[] = [];   
  leaverequset: any;

    constructor(private masterDataService: MasterDataService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.getLeaveRequest();         
      
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

   
   
    
}



