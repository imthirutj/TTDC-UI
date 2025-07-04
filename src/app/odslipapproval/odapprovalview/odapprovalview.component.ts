import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DataService } from 'src/app/data.Service';

@Component({
  selector: 'app-odapprovalview',
  templateUrl: './odapprovalview.component.html',
  styleUrls: ['./odapprovalview.component.css']
})

export class OdapprovalviewComponent {
  // odslipId: any;
  odslipId: string | null = null;
  payobj: any = {};

  constructor(
    private masterDataService: MasterDataService,
    private route: ActivatedRoute,
    private dataService : DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.odslipId = params['odslip_id'];
      console.log('OD Slip ID:', this.odslipId);
    });
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.masterDataService
      .getODDetails(`?odslip_id=${this.odslipId}`)
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          if (response.success) {
            this.payobj = response.data[0];
            console.log('Pay Object:', this.payobj);
          } else {
            console.error(response.message || 'Failed to fetch OD slip details.');
          }
        },
        (error) => {
          console.error('Error fetching OD slip details:', error);
        }
      );
  }
  

  downloadPDF(): void {
    const element = document.getElementById('pdfContent');

    if (element) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('ODslip.pdf');
      });
    }
  }

  approveODSlip(): void {
    if (this.odslipId) {
      const payload = {
        visiting_Manager_Approval: "Approved",
        odslip_Id: this.odslipId // Use the initialized odslipId
      };

      this.masterDataService.approveODSlip(payload).subscribe(
        (response) => {
          if (response.success) {
            this.dataService.showSnackBar('OD slip approved successfully.');
            location.reload();
          } else {
            console.error(response.message || 'Failed to approve OD slip.');
          }
        },
        (error) => {
          console.error('Error approving OD slip:', error);
        }
      );
    } else {
      console.error('OD Slip ID is not available for approval.');
    }
  }


  
  disapproveODSlip(): void {
    if (this.odslipId) {
      const payload = {
        visiting_Manager_Approval: "Not Approved",
        odslip_Id: this.odslipId
      };

      this.masterDataService.approveODSlip(payload).subscribe(
        (response) => {
          if (response.success) {
            console.log('OD slip disapproved successfully.');
            location.reload();
          } else {
            console.error(response.message || 'Failed to disapprove OD slip.');
          }
        },
        (error) => {
          console.error('Error disapproving OD slip:', error);
        }
      );
    } else {
      console.error('OD Slip ID is not available for disapproval.');
    }
  }
  
}
