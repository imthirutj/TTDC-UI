import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-pay-slip',
  templateUrl: './pay-slip.component.html',
  styleUrls: ['./pay-slip.component.css']
})
export class PaySlipComponent {
  payId:any
  empId:any
  empObj:any={}
  payobj:any={}
  payslips:any[]=[]
constructor(private masterDataService: MasterDataService,private route:ActivatedRoute) {}
    ngOnInit(): void {      
      this.payId = this.route.snapshot.paramMap.get('payId');
      this.empId = this.route.snapshot.queryParamMap.get('empId');
      this.loadEmployeeData()
    }

    loadEmployeeData()
    {
      // this.masterDataService.payslips('?EffPeriod=Nov-2024&EmpId='+this.empId+'').subscribe(
      //   (response: any) => {
      //     console.log('API Response:', response);
      //     if (response.success && Array.isArray(response.data)) {
      //       this.empObj = response.data;            
      //     } else {
      //       // alert(response.message || 'Failed to fetch Department list.');
      //     }
      //   },
      //   (error) => {
      //     // console.error('Error fetching Department list:', error);
      //     // alert('An error occurred while fetching the Department list.');
      //   }
      // );
      this.masterDataService.payslipdetails('?PayslipRecordId='+this.payId+'').subscribe(
        (response: any) => {
          
          if (response.success ) {
            this.payobj = response.data;            
          } else {
            // alert(response.message || 'Failed to fetch Department list.');
          }
        },
        (error) => {
          // console.error('Error fetching Department list:', error);
          // alert('An error occurred while fetching the Department list.');
        }
      );
    }
    downloadPDF(): void {
      const element = document.getElementById('pdfContent');
    
      if (element) {
        html2canvas(element).then((canvas) => {
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
    
          pdf.save('payslip.pdf');
        });
      }
    }
}
