import { Component } from '@angular/core';
import { myMonths, myYears } from '../utils/helpers/variables';
import { color } from 'html2canvas/dist/types/css/types/color';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  months = myMonths;
  years = myYears;
  

 
 
  filters: any = {
    selectedMonth: {
      value: Number(new Date().getMonth()) + 1, // Default to current month
      show: true,
      key: 'selectedMonth',
      includeInSearchParams:true
    },
    selectedYear: {
      value: new Date().getFullYear(), // Default to current year
      show: true,
      key: 'selectedYear',
      includeInSearchParams:true
    },
  };
  

  
  arraybox_list = [
    { label: 'Total Company', count: 2, color: 'blue' },
    { label: 'Total City', count: 7, color: 'green' },
    { label: 'Total Employee', count: 855,  color: 'red' },
    { label: 'Department Count', count: 17, color: 'violet' },
    { label: 'Category Count', count: 1,  color: 'purple' },
    { label: 'Pay Generated', count: 3, color: 'orange' },
    { label: 'Pay Not Generated', count: 852,  color: 'gray' },
  ];

  // Event handler for filter change
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
  }
}
