import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MasterDataService } from '../../services/master-data.service';
import { DataService } from '../../data.Service';
import { UserType } from '../../common/user-type.enum';
import { myMonths, myYears } from '../../utils/helpers/variables';
import { VendorService } from '../vendor.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LoadingService } from '../../services/loading.service';
import { em } from '@fullcalendar/core/internal-common';


@Component({
  selector: 'app-vendor-invoice-details',
  templateUrl: './vendor-invoice-details.component.html',
  styleUrls: ['./vendor-invoice-details.component.css']
})
export class VendorInvoiceDetailsComponent {

  UserType = UserType;
  userAccessLevel: any;
  user: any;

  type: 'VIEW' | 'PREVIEW' = 'VIEW';

  month: any;
  year: any;
  vendorID: any;

  continuousIndex:number = 0;

    // Define the totals object
    totals = {
      totalPresentDays: 0,
      totalMonthDays:0,
      totalGrossSalary: 0,
      totalEPF: 0,
      totalESI: 0,
      totalActualCharge: 0,
      totalServiceCharge: 0,
      totalNetAmount: 0
    };

  vendorDetails: any={};
  vendorInvoiceDetails = {
    cumulativeInvoice: {
      invoiceRecords: [] as Array<{
        designationName: string;
        employeeCount: number;
        totalGrossSalary: number;
        totalNetSalary: number;
      }>,
      subTotalSalary: 0,
      subTotalEmpcount: 0,
      cgst: 0,
      sgst: 0,
      gst: 0,
      tds: 0,
      totalAmount: 0,
      totalSalWithCharges: 0,
      serviceCharge: 0,
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
        netAmount: number;
      }>;
    }>
  };

  cumulativeInvoiceRecords:any[]=[];
  constructor(
    private route: ActivatedRoute,
    private masterDataService: MasterDataService,
    private dataService: DataService,
    private vendorService: VendorService,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.month = params['month'];
      this.year = params['year'];
      this.vendorID = params['vendorId'];
      this.type = params['type'];

      if(!this.type){
        this.dataService.showSnackBar('Invalid URL');
        return;
      }

      console.log('Month:', this.month);
      console.log('Year:', this.year);
      console.log('Vendor ID:', this.vendorID);
    });

    this.dataService.asyncGetUser().then((user:any) => {
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
    if(this.type== 'VIEW'){
      this.vendorService.viewVendorInvoiceDetails(payload).subscribe((response) => {
        console.log('Vendor Invoice Details:', response);
        this.vendorInvoiceDetails = response.data.invoice;
        //rmoeve invoive object from response.data
        var vendorDetailsObj = { ...response.data };
        delete vendorDetailsObj.invoice;
        this.vendorDetails = vendorDetailsObj;
        
        this.calculateTotals();
      });
    }
    else if(this.type== 'PREVIEW'){
      this.vendorService.preViewVendorInvoiceDetails(payload).subscribe((response) => {
        console.log('Vendor Invoice Details:', response);
        this.vendorInvoiceDetails = response.data.invoice;
        var vendorDetailsObj = { ...response.data };
        delete vendorDetailsObj.invoice;
        this.vendorDetails = vendorDetailsObj;

        this.calculateTotals();
      });
      // this.vendorService.viewVendorInvoiceDetails(payload).subscribe((response) => {
      //   console.log('Vendor Invoice Details:', response);
      //   this.vendorInvoiceDetails = response.data.invoice;
      //   this.vendorDetails = {
      //     vendorName: response.data.vendorName,
      //     vendorId: response.data.vendorId,
      //     gstin : response.data.gstin,
      //     panNo: response.data.panNo,
      //     emailId: response.data.emailId,
      //     address: response.data.address,
      //     contactNo: response.data.contactNo,
      //     updateDate: response.data.updateDate,
      //     vendorInvoiceID: response.data.vendorInvoiceID
      //   }
      //   this.calculateTotals();
      // });
    }
    else{
      this.dataService.showSnackBar('Invalid URL');
    }
    
  }

  calculateTotals() {
    // Reset the totals for every recalculation
    this.totals.totalPresentDays = 0;
    this.totals.totalMonthDays = 0;
    this.totals.totalGrossSalary = 0;
    this.totals.totalEPF = 0;
    this.totals.totalESI = 0;
    this.totals.totalActualCharge = 0;
    this.totals.totalServiceCharge = 0;
    this.totals.totalNetAmount = 0;

    // Loop through the invoice details and employee invoices to sum the values
    this.vendorInvoiceDetails.invoiceDetail.forEach(invDetail => {
      invDetail.employeeInvoices.forEach(empInvoiceDetail => {
        this.totals.totalPresentDays += empInvoiceDetail.presentDays;
        this.totals.totalMonthDays += empInvoiceDetail.monthDays;
        this.totals.totalGrossSalary += empInvoiceDetail.grossSalary;
        this.totals.totalEPF += empInvoiceDetail.epf;
        this.totals.totalESI += empInvoiceDetail.esi;
        this.totals.totalActualCharge += empInvoiceDetail.actualCharge;
        this.totals.totalServiceCharge += empInvoiceDetail.serviceCharge;
        this.totals.totalNetAmount += empInvoiceDetail.netAmount;
      });
    });
  }

  getAndIncrementIndex(): number {
    const currentIndex = this.continuousIndex;
    this.continuousIndex += 1;  // Increment for the next row
    return currentIndex + 1;    // Return the current index (displayed index will be +1)
  }

  downloadPDF() {
    this.dataService.downloadPDF('invoice-component');
  }

}
