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
  approval: any;

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

    this.approval = {
      // employeeId: 3846,
      Nos_Days_Approved_by_Manager: '',
      Manager_Approval_Remarks: ''

    }
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

  fullyApproved(): void {
    if (this.leaveRequest_Id && this.payobj) {
      // Parse the from_Date and to_Date from the payobj
      const fromDate = new Date(this.payobj.from_Date);
      const toDate = new Date(this.payobj.to_Date);
  
      // Calculate the number of days between fromDate and toDate
      const timeDiff = toDate.getTime() - fromDate.getTime();
      const numOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Adding 1 to include both start and end date
  
      // Prepare the payload for the approval
      const payload = {
        manager_Approval_Status: "Approved",
        nos_Days_Approved_by_Manager: numOfDays,
        leaveRequest_Id: this.leaveRequest_Id
      };

      this.masterDataService.approveLeaveRequest(payload).subscribe(
        (response) => {
          if (response.success) {
            console.log('Leave Request approved successfully.');
            location.reload();
          } else {
            console.error(response.message || 'Failed to approve Leave Request.');
          }
        },
        (error) => {
          console.error('Error approving Leave Request:', error);
        }
      );
    } else {
      console.error('Leave Request ID is not available for approval.');
    }
  }

  partiallyApproved(): void {
    if (this.leaveRequest_Id) {
      const payload = {
        manager_Approval_Status: "Partially Complete",
        leaveRequest_Id: this.leaveRequest_Id,
        nos_Days_Approved_by_Manager: this.approval.Nos_Days_Approved_by_Manager,
        manager_Approval_Remarks: this.approval.Manager_Approval_Remarks
      };
  
      this.masterDataService.approveLeaveRequest(payload).subscribe(
        (response) => {
          if (response.success) {
            console.log('Leave Request approved successfully.');
            location.reload();
          } else {
            console.error(response.message || 'Failed to approve Leave Request.');
          }
        },
        (error) => {
          console.error('Error approving Leave Request:', error);
        }
      );
    } else {
      console.error('Leave Request ID is not available for approval.');
    }
  }
  

  disapprove(): void {
    if (this.leaveRequest_Id) {
      const payload = {
        manager_Approval_Status: "Not Approved",
        leaveRequest_Id: this.leaveRequest_Id
      };

      this.masterDataService.approveLeaveRequest(payload).subscribe(
        (response) => {
          if (response.success) {
            console.log('Leave Request disapproved successfully.');
            location.reload();
          } else {
            console.error(response.message || 'Failed to disapprove Leave Request.');
          }
        },
        (error) => {
          console.error('Error disapproving Leave Request:', error);
        }
      );
    } else {
      console.error('Leave Request ID is not available for disapproval.');
    }
  }

}



