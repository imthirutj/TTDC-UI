import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-leaveapprovalupdate',
  templateUrl: './leaveapprovalupdate.component.html',
  styleUrls: ['./leaveapprovalupdate.component.css']
})


export class LeaveapprovalupdateComponent {
  leaveRequest_Id: any;
  payobj: any = {};

  constructor(
    private masterDataService: MasterDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.leaveRequest_Id = params['leaveRequest_Id'];
      console.log('leaveRequest ID:', this.leaveRequest_Id);
    });
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.masterDataService
      .LeaveRequest_View(`?leaveRequest_Id=${this.leaveRequest_Id}`)
      .subscribe(
        (response: any) => {
          console.log('Response:', response);
          if (response.success) {
            this.payobj = response.data[0];
            console.log('Pay Object:', this.payobj);
          } else {
            console.error(response.message || 'Failed to fetch Leave Request details.');
          }
        },
        (error) => {
          console.error('Error fetching Leave Request details:', error);
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

        pdf.save('LeaveRequest.pdf');
      });
    }
  }

  approveODSlip(): void {
    if (this.leaveRequest_Id) {
      const payload = {
        visiting_Manager_Approval: 1,
        odslipId: this.leaveRequest_Id // Use the initialized odslipId
      };

      this.masterDataService.approveLeaveRequest(payload).subscribe(
        (response) => {
          if (response.success) {
            console.log('OD slip approved successfully.');
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
    if (this.leaveRequest_Id) {
      const payload = {
        visiting_Manager_Approval: 0,
        odslipId: this.leaveRequest_Id
      };

      this.masterDataService.approveLeaveRequest(payload).subscribe(
        (response) => {
          if (response.success) {
            console.log('OD slip disapproved successfully.');
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



