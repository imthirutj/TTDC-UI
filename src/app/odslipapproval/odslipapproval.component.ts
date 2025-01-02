import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-odslipapproval',
  templateUrl: './odslipapproval.component.html',
  styleUrls: ['./odslipapproval.component.css']
})


export class OdslipapprovalComponent {
  odcompanylist: any[] = []; 
  odslip: any;

    constructor(private masterDataService: MasterDataService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.getODCompany(); 
       
      
    }
    getODCompany(): void {
      const query = '?comp_id=33'; // Build the query string
      this.masterDataService.getODComapnyList(query).subscribe(
        (response: any) => {
          console.log('API Response:', response);
          if (response.success && Array.isArray(response.data)) {
            this.odcompanylist = response.data; 
            console.log('od company list:', this.odcompanylist);
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


