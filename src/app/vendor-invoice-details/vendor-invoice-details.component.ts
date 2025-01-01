import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { UserType } from '../common/user-type.enum';
import { myMonths, myYears } from '../utils/helpers/variables';
import { VendorService } from '../vendor/vendor.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-vendor-invoice-details',
  templateUrl: './vendor-invoice-details.component.html',
  styleUrls: ['./vendor-invoice-details.component.css']
})
export class VendorInvoiceDetailsComponent {

  UserType = UserType;
  userAccessLevel: any;
  user: any;

  month: any;
  year: any;
  vendorID: any;

  vendorInvoiceDetails = {
    cumulativeInvoice: {
      invoiceRecords: [] as Array<{
        designationName: string;
        employeeCount: number;
        totalGrossSalary: number;
      }>,
      subTotalSalary: 0,
      subTotalEmpcount: 0,
      cgst: 0,
      sgst: 0,
      totalAmount: 0,
      rupeesInWords: ''
    },
    invoiceDetail: [] as Array<{
      designationId: number;
      designationName: string;
      employeeInvoices: Array<{
        employeeId: number;
        employeeName: string;
        grossSalary: number;
        epf: number;
        esi: number;
        presentDays: number;
        monthDays: number;
        actualCharge: number;
        serviceCharge: number;
        amountClaimed: number;
      }>;
    }>
  };

  cumulativeInvoiceRecords:any[]=[];
  constructor(
    private route: ActivatedRoute,
    private masterDataService: MasterDataService,
    private dataSerivce: DataService,
    private vendorService: VendorService
  ) {
    this.route.queryParams.subscribe(params => {
      this.month = params['month'];
      this.year = params['year'];
      this.vendorID = params['vendorId'];

      console.log('Month:', this.month);
      console.log('Year:', this.year);
      console.log('Vendor ID:', this.vendorID);
    });

    this.dataSerivce.getUser().subscribe((user) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);

    });
  }


  ngOnInit(): void {
    this.fetchVendorInvoiceDetails();
  }

  fetchVendorInvoiceDetails(){
    var payload={
      month: this.month,
      year: this.year,
      vendorId: this.vendorID
    }
    this.vendorService.getVendeorInvoiceDetails(payload).subscribe((response) => {
      console.log('Vendor Invoice Details:', response);
      this.vendorInvoiceDetails = response.data;
    });
  }

}
