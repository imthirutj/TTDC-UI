import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from '../data.Service';
import { CompensateRequest } from '../utils/interface/CompensateRequest';
import { Action } from '../common/action.enum';
import { EmployeeWorkReportService } from '../employee-work-report/employee-work-report.service';


@Component({
  selector: 'app-compensate-request',
  templateUrl: './compensate-request.component.html',
  styleUrls: ['./compensate-request.component.css']
})
export class CompensateRequestComponent {
    leaverequstlist: any[] = [];
  leaverequset: any;
  Action = Action;

  compensateRequests: CompensateRequest[] = [];
  availableCompensatedDates: any[] = [];
  modal = {
    show: false,
    title: '',
    action: '',
    data: new CompensateRequest()
  }

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
    private dataService: DataService,
    private employeeWorkReportService: EmployeeWorkReportService) { 

    }
  ngOnInit(): void {


  }



  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.search();
  }

  search() {
    this.getCompensationRequests();
    this.getAvailableCompensatedDates(this.filters.employeeId.value);
  }

  getAvailableCompensatedDates(employeeId: any) {
    var payload = {
      employeeId: employeeId
    }
    this.availableCompensatedDates = [];
    this.employeeWorkReportService.getAvailableCompensatedDates(payload).subscribe((response) => {
      if (response.success) {
        this.availableCompensatedDates = response.data;
      }
    })
  }


  getCompensationRequests(): void {

    this.compensateRequests = [];
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getCompensationRequests(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.compensateRequests = response.data;
          this.dataService.showSnackBar('CompensateRequest fetched successfully');
        }
      }
    );
  }

  saveCompensateRequest(): void {
    var employeeId = this.filters.employeeId.value;
    if (!employeeId) {
      this.dataService.showSnackBar('Employee Not Found');
      return;
    }
    const payload = {
      ...this.modal.data,
      employeeId: employeeId
    }
    if(!payload.compensatedDate){
      this.dataService.showSnackBar('Compensated Date Not Found');
      return;
    }
    this.masterDataService.saveCompensationRequest(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('CompensateRequest saved successfully');
          this.search();
        } 
      }
    );
  }

  openModal() {
    this.modal.show = true;
    this.modal.action = Action.CREATE;
    this.modal.title = 'Add Compensate Request';

    this.modal.data = new CompensateRequest();
  }

  closeModal() {
    this.modal.show = false;
    this.modal.action = '';
    this.modal.title = '';
    this.modal.data = new CompensateRequest();
  }

}
