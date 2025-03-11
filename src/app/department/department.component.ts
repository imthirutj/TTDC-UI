import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from '../data.Service';
import { Department } from '../utils/interface/Department';
import { Action } from '../common/action.enum';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})

export class DepartmentComponent implements OnInit {
  Department: any[] = []; 
  Action = Action;
  modal = {
    action: '',
    obj:  new Department(),
    show: false,
    title: ''
  };

  constructor(private masterDataService: MasterDataService,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getDepartmentList(); 
  }

  getDepartmentList(): void {
    this.masterDataService.getDepartment().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Department = response.data; 
          console.log('Department list:', this.Department);
        } else {
          alert(response.message || 'Failed to fetch Department list.');
        }
      },
      (error) => {
        console.error('Error fetching Department list:', error);
        alert('An error occurred while fetching the Department list.');
      }
    );
  }

  
    openModal(action: Action, obj?: Department): void {
      this.modal.show = true;
      this.modal.action = action;
      this.modal.title = action == Action.UPDATE ? 'Edit Section' : action == Action.CREATE ? 'Add Section' : '';
  
      if (action == Action.UPDATE || action == Action.VIEW) {
        if (obj) {
          this.modal.obj = { ...obj };
        }
        else {
          this.dataService.showSnackBar('Not found');
        }
      }
      else {
        this.modal.obj = new Department();
      }
    }
    closeModal() {
      this.modal.show = false;
      this.modal.obj = new Department();
      this.modal.action = '';
      this.modal.title = '';
    }


    
  saveDepartment(){

    const payload={
      ...this.modal.obj
    }
    this.masterDataService.save_Department(payload).subscribe(
      (response : any)=>{
        if(response.success){
          this.getDepartmentList();
          this.closeModal();
          this.dataService.showSnackBar('Updated Section!');
        }
      }
    );
  }
}  


