import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Action } from '../common/action.enum';
import { DataService } from '../data.Service';
import { DesignationQualification } from '../utils/interface/DesignationQualification';

@Component({
  selector: 'app-designation-qualification',
  templateUrl: './designation-qualification.component.html',
  styleUrls: ['./designation-qualification.component.css']
})


export class DesignationQualificationComponent {
  Action = Action;

  Designation_Qualification_list: DesignationQualification[] = [];


  Designation: any[] = [];
  degreelist: any[] = [];

  modal = {
    action: '',
    obj: new DesignationQualification(),
    show: false,
    title: ''
  };

  constructor(private masterDataService: MasterDataService,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }
  ngOnInit(): void {
    this.get_Designation_Qualification();
    this.getDesignationList();
    this.getdegree();



  }
  get_Designation_Qualification(): void {
    this.masterDataService.get_Designation_Qualification('').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.Designation_Qualification_list = response.data;
          console.log('od company list:', this.Designation_Qualification_list);
        }
      }
    );
  }

  getdegree(): void {
    // const query = '?comp_id=33'; 
    this.masterDataService.getdegree('').subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.degreelist = response.data;
          console.log('od company list:', this.degreelist);
        }
      }
    );
  }

  getDesignationList(): void {
    this.masterDataService.getDesignation().subscribe((response: any) => {
      if (response?.success) {
        this.Designation = response.data;
      }
    });
  }

  saveDesignation_Qualification(): void {

    const payload = {
      ...this.modal.obj,
    }
    this.masterDataService.save_Designation_Qualification(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Designation Qualification updated successfully.');
          this.get_Designation_Qualification();
        }
      }
    );
  }

  deleteDesignationQualifications(id: any): void {
    this.masterDataService.deleteDesignationQualifications(id).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Designation Qualification deleted successfully.');
          this.get_Designation_Qualification();
        }
      }
    );
  }

  openModal(action: Action, obj?: DesignationQualification): void {
    this.modal.show = true;
    this.modal.action = action;
    this.modal.title = action == Action.UPDATE ? 'Edit Designation-Qualification' : action == Action.CREATE ? 'Add Designation-Qualification' : '';

    if (action == Action.UPDATE || action == Action.VIEW) {
      if (obj) {
        this.modal.obj = { ...obj };
      }
      else {
        this.dataService.showSnackBar('Not found');
      }
    }
    else {
      this.modal.obj = new DesignationQualification();
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
    this.Designation_Qualification_list.sort((a:any, b:any) => {
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



