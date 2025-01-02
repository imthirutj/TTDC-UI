import { Component } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  months = myMonths;
  years = myYears;
  

 
  filters:any = {
    selectedMonth:Number(new Date().getMonth() ) +1,
    selectedYear: new Date().getFullYear(), 
    visibility:{
      showMonthDropdown: true, 
      showYearDropdown: true,
    }
    
  };

  
  arraybox_list = [
    { label: 'Total Company', count: 2 },
    { label: 'Total City', count: 7 },
    { label: 'Total Employee', count: 855 },
    { label: 'Department Count', count: 17 },
    { label: 'Category Count', count: 1 },
    { label: 'Pay Generated', count: 3 },
    { label: 'Pay Not Generated', count: 852 }
  ];

  // Event handler for filter change
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
  }
}
