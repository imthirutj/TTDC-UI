import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Action } from '../common/action.enum';
import { DataService } from '../data.Service';
import { Designation } from '../utils/interface/Designation';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css']
})

export class DesignationComponent implements OnInit {
  Designation: Designation[] = []; 
  Action = Action;

  modal = {
    action: '',
    obj:  new Designation(),
    show: false,
    title: ''
  };

  constructor(private masterDataService: MasterDataService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.getDesignationList(); 
  }

  getDesignationList(): void {
    this.masterDataService.getDesignation().subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Designation = response.data; 
          console.log('Designation list:', this.Designation);
        } else {
          alert(response.message || 'Failed to fetch Designation list.');
        }
      },
      (error) => {
        console.error('Error fetching Designation list:', error);
        alert('An error occurred while fetching the Designation list.');
      }
    );
  }

  
  openModal(action: Action, obj?: Designation): void {
    this.modal.show = true;
    this.modal.action = action;
    this.modal.title = action == Action.UPDATE ? 'Edit Designation' : action == Action.CREATE ? 'Add Designation-Qualification' : '';

    if (action == Action.UPDATE || action == Action.VIEW) {
      if (obj) {
        this.modal.obj = { ...obj };
      }
      else {
        this.dataService.showSnackBar('Not found');
      }
    }
    else {
      this.modal.obj = new Designation();
    }
  }
  closeModal() {
    this.modal.show = false;
    this.modal.obj = new Designation();
    this.modal.action = '';
    this.modal.title = '';
  }

  saveDesignation(){

    const payload={
      ...this.modal.obj
    }
    this.masterDataService.save_Designation(payload).subscribe(
      (response : any)=>{
        if(response.success){
          this.getDesignationList();
          this.closeModal();
          this.dataService.showSnackBar('Updated designation!');
        }
      }
    );
  }
}  


