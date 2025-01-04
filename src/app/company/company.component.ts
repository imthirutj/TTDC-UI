import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from '../data.Service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  Company: any[] = []; 

  filters: any = {
    cityId: {
      value: '',
      show: true,
      key: 'cityId',
      includeInSearchParams: true
    },
  };
  constructor(private masterDataService: MasterDataService,
    private dataservice: DataService
  ) {}

  ngOnInit(): void {
    this.getCompanyList(); 
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getCompanyList();
  }

  search() {
    this.getCompanyList();
  }

  getCompanyList(): void {
    const payload = this.dataservice.getPayloadValue(this.filters);
    this.masterDataService.getCompany(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Company = response.data; 
          console.log('Company list:', this.Company);
        } 
      }
    );
  }
}  


