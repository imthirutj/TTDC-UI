import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Degree } from '../utils/interface/Degree';
import { Action } from '../common/action.enum';
import { DataService } from '../data.Service';

@Component({
  selector: 'app-degree',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.css']
})

export class DegreeComponent {
  degreelist: Degree[] = [];
  degree: any;

  Action = Action;


  
    modal = {
      action: '',
      obj: new Degree(),
      show: false,
      title: ''
    };

  constructor(private masterDataService: MasterDataService, 
    private route: ActivatedRoute,
    private dataService: DataService) { }
  ngOnInit(): void {
    this.getdegree();

    this.degree = {

      degree_Name: ''

    }

  }
  getdegree(): void {
    // const query = '?comp_id=33'; 
    this.masterDataService.getdegree('').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.degreelist = response.data;
          console.log('od company list:', this.degreelist);
        } else {
          alert(response.message || 'Failed to fetch od company list.');
        }
      },
      (error) => {
        console.error('Error fetching OD company list:', error);
        alert('An error occurred while fetching the OD company list.');
      }
    );
  }



  savedegree(): void {
    const payload = {
      ...this.modal.obj,
    }

    this.masterDataService.savedegree(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('degree updated successfully.');
          this.getdegree();
        }
      }
    );
  }

  deleteDegree(id: any): void {
    this.masterDataService.deleteDegree(id).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Degree deleted successfully.');
          this.getdegree();
        }
      }
    );
  }


  
    openModal(action: Action, obj?: Degree): void {
      this.modal.show = true;
      this.modal.action = action;
      this.modal.title = action == Action.UPDATE ? 'Edit Degree' : action == Action.CREATE ? 'Add Degree' : '';
  
      if (action == Action.UPDATE || action == Action.VIEW) {
        if (obj) {
          this.modal.obj = { ...obj };
        }
        else {
          this.dataService.showSnackBar('Not found');
        }
      }
      else {
        this.modal.obj = new Degree();
      }
    }

    closeModal() {
      this.modal.show = false;
      this.modal.obj = {} as any;
      this.modal.action = '';
      this.modal.title = '';
    }


  // Variables to keep track of sort state
  sortBy: string = 'date';  // Default sorting by 'date'
  sortOrder: string = 'asc'; // Default ascending order
  // Sort the data based on column name and order
  sortData(column: string): void {
    // Toggle sorting order if the same column is clicked
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc'; // Reset to ascending when changing column
    }

    // Perform sorting based on the selected column and order
    this.degreelist.sort((a: any, b: any) => {
      let valueA = a[column];
      let valueB = b[column];

      // Handle case for dates (sort Date objects)
      if (column === 'date') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) {
        return this.sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }


}


