import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from '../data.Service';

@Component({
  selector: 'app-odslipapproval',
  templateUrl: './odslipapproval.component.html',
  styleUrls: ['./odslipapproval.component.css']
})


export class OdslipapprovalComponent {
  odcompanylist: any[] = [];
  odslip: any;


  filters: any = {
    selectedMonth: {
      value: Number(new Date().getMonth()) + 1, // Default to current month
      show: false,
      key: 'month',
      includeInSearchParams: false
    },
    selectedYear: {
      value: new Date().getFullYear(), // Default to current year
      show: false,
      key: 'year',
      includeInSearchParams: false
    },
    cityId: {
      value: '',
      show: true,
      key: 'cityId',
      includeInSearchParams: true
    },
    companyId: {
      value: '',
      show: true,
      key: 'compId',
      includeInSearchParams: true
    },
    designationId: {
      value: '',
      show: true,
      key: 'designationId',
      includeInSearchParams: true
    },
    employeeCode: {
      value: '',
      show: true,
      key: 'employeeCode',
      includeInSearchParams: true
    },
    vendorId: {
      value: '',
      show: false,
      key: 'vendorId',
      includeInSearchParams: false
    },
    role:{
      value: '',
      show: false,
      key: 'role',
      includeInSearchParams: true
    }
  };

  constructor(private masterDataService: MasterDataService, 
    private route: ActivatedRoute,
  private dataService: DataService) { 

  }
  ngOnInit(): void {
    //this.getODCompany();


  }


  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getODCompany();
  }

  search(){
    this.getODCompany();
  }

  getODCompany(): void {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getODComapnyList(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
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


