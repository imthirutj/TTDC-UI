import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.Service';
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
    deptId: {
      value: '',
      show: true,
      key: 'deptId',
      includeInSearchParams: true
    },
    catId: {
      value: '',
      show: true,
      key: 'catId',
      includeInSearchParams: true
    },
    employeeId: {
      value: '',
      show: true,
      key: 'employeeId',
      includeInSearchParams: true
    },
    vendorId: {
      value: '',
      show: false,
      key: 'vendorId',
      includeInSearchParams: false
    },
  };

  constructor(private masterDataService: MasterDataService, 
    private route: ActivatedRoute,
  private dataService : DataService) { }
  ngOnInit(): void {
    this.getODCompany();
    this.getCompanyList();
    this.getEmployeeList();

    this.odslip = {
      employeeId: 0,
      manager_Id: '3',
      visiting_Company_Id: '',
      purpose: '',
      from_Date: '',
      to_Date: '',
      how_Many_Days: '',
      insert_Manager_id: '2'

    }

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

