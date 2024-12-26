import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-odslip',
  templateUrl: './odslip.component.html',
  styleUrls: ['./odslip.component.css']
})

export class OdslipComponent {
  payId:any
  empId:any
  empObj:any={}
  payobj:any={}
  payslips:any[]=[]
constructor(private masterDataService: MasterDataService,private route:ActivatedRoute) {}
    ngOnInit(): void {      
      
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
    
          pdf.save('ODslip.pdf');
        });
      }
    }
}
