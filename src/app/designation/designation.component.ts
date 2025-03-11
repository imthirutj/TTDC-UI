import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Action } from '../common/action.enum';
import { DataService } from '../data.Service';
import { Designation } from '../utils/interface/Designation';
import { ActivatedRoute } from '@angular/router';

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

  filters: any = {
   
  };

  constructor(private masterDataService: MasterDataService,
    public dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   // this.getDesignationList(); 
  }

  
  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
  
    this.route.queryParams.subscribe(params => {
      if (params['passedFilter'] == '1') {
        this.dataService.applyFilter(this.filters).then(() => {
          this.search();
        });
      } else {
        this.search();
      }
    });
  }

  search() {
    this.getDesignationList();
  }


  getDesignationList(): void {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getDesignationMasters(payload).subscribe(
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
    this.modal.title = action == Action.UPDATE ? 'Edit Designation' : action == Action.CREATE ? 'Add Designation' : '';

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


