import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.css']
})

export class CompanylistComponent {
  odcompanylist: any[] = []; 
  Employee: any[] = [];
  Company: any[] = []; 
  odslip: any;

    constructor(private masterDataService: MasterDataService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      this.getODCompany(); 
      this.getCompanyList();
      this.getEmployeeList();

      this.odslip={
        employeeId: 0,
        manager_Id: '3',
        visiting_Company_Id: '',
        purpose: '',
        from_Date: '',
        to_Date: '',
        how_Many_Days: '',
       
      }
      
    }
    getODCompany(): void {
      const query = '?comp_id=20'; // Build the query string
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

    getCompanyList(): void {
      this.masterDataService.getCompanylist().subscribe((response: any) => {
        if (response?.success && Array.isArray(response.data)) {
          this.Company = response.data;
        } else {
          alert(response?.message || 'Failed to fetch Company list.');
        }
      });
    }

    getEmployeeList(): void {
      this.masterDataService.getEmployees().subscribe((response: any) => {
        if (response?.success && Array.isArray(response.data)) {
          this.Employee = response.data;
        } else {
          alert(response?.message || 'Failed to fetch Employee list.');
        }
      });
    }

    saveodslip(odslip: any): void {
      console.log(odslip)
        // if (!this.employeeForm) {
        //   console.error('Form not initialized.');
        //   return;
        // }
      
        this.masterDataService.saveodslip(odslip).subscribe(
          (response: any) => {
            console.log('API Response:', response);
            if (response.success) {
              alert('odslip updated successfully.');
              this.getODCompany(); // Refresh the list
            } else {
              alert(response.message || 'Failed to update odslip.');
            }
          },
          (error: any) => {
            console.error('Error updating odslip:', error);
            alert('An error occurred while updating the odslip.');
          }
        );
      }
    
}

