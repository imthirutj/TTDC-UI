import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  years: number[] = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i); // Last 10 years
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November'
  ];

  arraybox_list=[{label:'Total Company',count:2},
    {label:'Total City',count:7},
    {label:'Total Employee',count:855},
    {label:'Department Count',count:17},
    {label:'Category Count',count:1},
    {label:'Pay Generated',count:3},
    {label:'Pay Not Generated',count:852}
  ]


  // Selected values
  selectedYear: number = new Date().getFullYear();
  selectedMonth: string = this.months[new Date().getMonth()];
}
