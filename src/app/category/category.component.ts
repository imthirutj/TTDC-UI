import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})


export class CategoryComponent implements OnInit {
  Category: any[] = []; 

  constructor(private masterDataService: MasterDataService) {}

  ngOnInit(): void {
    this.getCategoryList(); 
  }

  getCategoryList(): void {
    this.masterDataService.getCategory().subscribe(
      (response: any) => {
        if (response.success) {
          this.Category = response.data; 
        } else {
          alert(response.message || 'Failed to fetch Category list.');
        }
      },
      (error) => {
        console.error('Error fetching Category list:', error);
        alert('An error occurred while fetching the Category list.');
      }
    );
  }
}


