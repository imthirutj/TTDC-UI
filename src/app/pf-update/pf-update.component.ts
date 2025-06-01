import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Action } from '../common/action.enum';
import { DataService } from '../data.Service';
import { Designation } from '../utils/interface/Designation';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from '../common/user-type.enum';
import { ReportService } from '../reports/report.service';
import { PfUpdateService } from './pf-update.service';

@Component({
  selector: 'app-pf-update',
  templateUrl: './pf-update.component.html',
  styleUrls: ['./pf-update.component.css']
})
export class PfUpdateComponent {
  UserType = UserType;
  userAccessLevel: any;
  user: any;

  filters: any = {
    role: { value: '', show: false, key: 'role', includeInSearchParams: true },
    filterRange: {
      value: 0,
      show: false,
      key: 'filterRange',
      includeInSearchParams: true
    },
    selectedMonth: {
      value: Number(new Date().getMonth()) + 1,
      show: true,
      key: 'month',
      includeInSearchParams: true
    },
    selectedYear: {
      value: new Date().getFullYear(),
      show: true,
      key: 'year',
      includeInSearchParams: true
    },
    companyId: {
      value: '',
      show: true,
      key: 'compId',
      includeInSearchParams: true
    },
    employeeId: {
      value: '',
      show: false,
      key: 'EmployeeId',
      includeInSearchParams: false
    },
    vendorId: {
      value: '',
      show: true,
      key: 'vendorId',
      includeInSearchParams: true
    },

  };
  pageAttributes = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 100
  }
  data: any[] = [];
  pfNotCreditedCount: any = '-';

  modalPf: any = {
    show: false,
    title: 'PF BULK UPDATE',
    password: ''
  }

  modalCancelPf: any = {
    show: false,
    title: 'PF BULK CANCEL',
    password: ''
  }
  constructor(

    private masterDataService: MasterDataService,
    public dataService: DataService,
    private reportService: ReportService,
    private router: Router,
    private pfService: PfUpdateService
  ) {
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);


    });
  }

  ngOnInit() {

  }
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.search();
  }
  search() {
    this.pageAttributes.currentPage = 1;
    this.getCount();
    this.getData();
  }

  getCount() {
    const payload = this.dataService.getPayloadValue(this.filters);
    const fpayload = {
      ...payload
    }

    this.pfService.getPfNotCreditedCount(fpayload).subscribe(
      (response: any) => {
        if (response.success) {
          this.pfNotCreditedCount = response.data;
        }
      }
    );
  }





  getData() {
    const payload = this.dataService.getPayloadValue(this.filters);
    const fpayload = {
      ...payload,
      page: this.pageAttributes.currentPage,
      pageSize: this.pageAttributes.pageSize
    }

    this.pfService.getPfLogReport(fpayload).subscribe(
      (response: any) => {
        if (response.success) {
          this.data = response.data.logs;
          this.pageAttributes.totalPages = response.data.totalPages;
        }
      }
    );
  }

  openBulkUpdateModal() {
    if (!this.pfNotCreditedCount || this.pfNotCreditedCount <= 0) {
      this.dataService.showSnackBar('No Employees found to update PF');
      return;
    }
    this.modalPf.show = true;
    this.modalPf.password = '';
  }

  openCancelUpdateModal() {
    if (!this.pfNotCreditedCount || this.pfNotCreditedCount <= 0) {
      this.dataService.showSnackBar('No Employees found to update PF');
      return;
    }
    this.modalCancelPf.show = true;
    this.modalCancelPf.password = '';
  }

  closeBulkUpdateModal() {
    this.modalPf.show = false;
    this.modalPf.password = '';
  }

  closeCancelUpdateModal() {
    this.modalCancelPf.show = false;
    this.modalCancelPf.password = '';
  }


  bulkUpdateConfirm() {
    if (!this.pfNotCreditedCount || this.pfNotCreditedCount <= 0) {
      this.dataService.showSnackBar('No Employees found to update PF');
      return;
    }

    if (!this.modalPf.password || this.modalPf.password.length < 3) {
      this.dataService.showSnackBar('Please enter valid password');
      return;
    }

    var msg = `Are you sure want to update PF for ${this.pfNotCreditedCount} Employees?.`;
    const amount = this.pfNotCreditedCount * 6;
    msg += ` Total Cost: ~ Rs ${amount}`;


    this.dataService.openConfirmationDialog2({
      title: ``,
      message: msg,
      onYes: () => {
        this.bulkUpdate();
      }
    });
  }

  cancelBulkUpdateConfirm() {
    if (!this.modalCancelPf.password || this.modalCancelPf.password.length < 3) {
      this.dataService.showSnackBar('Please enter valid password');
      return;
    }

    this.dataService.openConfirmationDialog2({
      title: ``,
      message: 'This will cancel the bulk update process. Are you sure you want to cancel?',
      onYes: () => {
        this.cancelBulkUpdate();
      }
    });
  }
  bulkUpdate() {
    const payload = this.dataService.getPayloadValue(this.filters);
    payload.password = this.modalPf.password;
    this.pfService.bulkUpdatePf(payload).subscribe(
      (response: any) => {
        if (response.status) {
          this.dataService.showSnackBar(response.message);
          this.closeBulkUpdateModal();
          this.getData();
        }
      }
    );
  }
  cancelBulkUpdate() {
    const payload = {
      password: this.modalCancelPf.password
    }
    this.pfService.cancelBulkUpdate(payload).subscribe(
      (response: any) => {
        if (response.status) {
          this.dataService.showSnackBar(response.message);
          this.closeCancelUpdateModal();
          this.getData();
        }
      }
    );
  }

  expandedItems = new Set<any>();

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2); // Pretty print
  }

  truncateJson(obj: any): string {
    const json = JSON.stringify(obj);
    return json.length > 100 ? json.substring(0, 100) + '...' : json;
  }

  toggleJson(key: string, item: any) {
    if (this.expandedItems.has(item)) {
      this.expandedItems.delete(item);
    } else {
      this.expandedItems.add(item);
    }
  }

  isExpanded(item: any): boolean {
    return this.expandedItems.has(item);
  }

}
