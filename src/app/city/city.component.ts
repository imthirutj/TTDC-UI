import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})

export class CityComponent implements OnInit {
  city: any[] = []; 

  constructor(private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.getcityList(); 
  }

  getcityList(): void {
    this.masterDataService.getCity(null).subscribe(
      (response: any) => {
        if (response.success) {
          this.city = response.data; 
        } else {
          alert(response.message || 'Failed to fetch city list.');
        }
      },
      (error) => {
        console.error('Error fetching city list:', error);
        alert('An error occurred while fetching the city list.');
      }
    );
  }
}

