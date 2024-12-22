import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  Company: any[] = []; 

  constructor(private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.getCompanyList(); 
  }

  getCompanyList(): void {
    this.masterDataService.getCompany().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Company = response.data; 
          console.log('Company list:', this.Company);
        } else {
          alert(response.message || 'Failed to fetch Company list.');
        }
      },
      (error) => {
        console.error('Error fetching Company list:', error);
        alert('An error occurred while fetching the Company list.');
      }
    );
  }
}  


