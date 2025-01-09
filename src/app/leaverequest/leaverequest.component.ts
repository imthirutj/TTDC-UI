import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from '../data.Service';

@Component({
  selector: 'app-leaverequest',
  templateUrl: './leaverequest.component.html',
  styleUrls: ['./leaverequest.component.css']
})


export class LeaverequestComponent {
  leaverequstlist: any[] = [];
  leaverequset: any;

  

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
      key: 'companyId',
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
      show: true,
      key: 'vendorId',
      includeInSearchParams: true
    },
  };

  constructor(private masterDataService: MasterDataService, 
    private route: ActivatedRoute,
  private dataService: DataService) { }
  ngOnInit(): void {
  
    this.leaverequset = {
      purpose: '',
      from_Date: '',
      to_Date: '',
      no_Of_Days: '',

    }

  }


  
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getLeaveRequest();
  }

  search(){
    this.getLeaveRequest();
  }


  getLeaveRequest(): void {
    
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getLeaveRequest(payload).subscribe(
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
    const payload = {
      ...leaverequset,
      employeeId:this.filters.employeeId.value
    }
    this.masterDataService.saveLeaveRequest(payload).subscribe(
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


