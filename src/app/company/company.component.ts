import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from '../data.Service';
import { Action, ModuleType } from '../common/action.enum';
import { Company } from '../utils/interface/Company';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  Action = Action;
  ModuleType = ModuleType;
  Company: Company[] = [];

  cities:any[]=[];
  modal = {
    action: Action.NONE,
    module: ModuleType.NONE,
    show: false,
    isEdit: false,
    title: '',
    company: new Company(),  // Use the Employee class here
  };


  filters: any = {
    cityId: {
      value: '',
      show: true,
      key: 'cityId',
      includeInSearchParams: true
    },
  };
  constructor(private masterDataService: MasterDataService,
    private dataservice: DataService
  ) { }

  ngOnInit(): void {
    this.getCompanyList();
    this.getcityList();
  }

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getCompanyList();
  }

  search() {
    this.getCompanyList();
  }

  getCompanyList(): void {
    const payload = this.dataservice.getPayloadValue(this.filters);
    this.masterDataService.getCompany(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Company = response.data;
          console.log('Company list:', this.Company);
        }
      }
    );
  }

  getcityList(): void {
    this.masterDataService.getCity({}).subscribe(
      (response: any) => {
        if (response.success) {
          this.cities = response.data; 
        } 
      }
    );
  }

  openModal(action: Action, company?: Company): void {
    this.modal.show = true;
    this.modal.action = action;
    this.modal.module = ModuleType.EMPLOYEE;
    this.modal.title = action == Action.UPDATE ? 'Edit Company' : action == Action.CREATE ? 'Add Company' : 'View Employee';
    if (action == Action.UPDATE || action == Action.VIEW) {
      if (company) {
        this.modal.company = { ...company };
      }
      else{
        this.dataservice.showSnackBar('Not found');
      }
    }
    else{
      this.modal.company = new Company();
    }
  }

  closeModal() {
    this.modal.show = false;
    this.modal.module = ModuleType.EMPLOYEE;
    this.modal.action = Action.NONE;
    this.modal.isEdit = false;
    this.modal.title = '';
    this.modal.company = new Company();
  }

  saveCompany(){
    const payload = {... this.modal.company}
    this.masterDataService.saveCompany(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.Company = response.data;
          this.getCompanyList();
          this.dataservice.showSnackBar('Company saved successfully');
          this.closeModal();
        }
      }
    )

  }

}


