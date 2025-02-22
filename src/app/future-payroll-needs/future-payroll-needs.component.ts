import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from 'src/app/data.Service';
import { Employee } from 'src/app/utils/interface/Employee';
import { Vendor } from 'src/app/utils/interface/vendor';
import { Category, City, Company, Department, Designation } from 'src/app/utils/interface/masters';
import { UserType } from 'src/app/common/user-type.enum';
import { Action, ModuleType } from 'src/app/common/action.enum';
import { ModuleTypeLabels } from 'src/app/common/labels';
import { BankDetails } from 'src/app/utils/interface/BankDetails';
import { WageDetails } from 'src/app/utils/interface/WageDetails';
import { UnitReports } from '../utils/interface/UnitReports';


@Component({
  selector: 'app-future-payroll-needs',
  templateUrl: './future-payroll-needs.component.html',
  styleUrls: ['./future-payroll-needs.component.css']
})
export class FuturePayrollNeedsComponent {


    Action = Action;
    ModuleType = ModuleType;
    ModuleTypeLabels = ModuleTypeLabels;
    UserType = UserType;
    user: any;
    userAccessLevel: any;
  
    Units: any[] = [];
  
  
    modalAnalysis={
      show: false,
      title:'Generate Analysis',
      unit: new UnitReports()
    }
  
  
    filters: any = {
      selectedMonth: {
        value: Number(new Date().getMonth()) + 1, // Default to current month
        show: false,
        key: 'month',
        includeInSearchParams: false
      },
      selectedYear: {
        value: new Date().getFullYear(), // Default to current year
        show: false,
        key: 'year',
        includeInSearchParams: false
      },
      cityId: {
        value: '',
        show: true,
        key: 'cityId',
        includeInSearchParams: true
      },
      companyId: {
        value: '',
        show: true,
        key: 'compId',
        includeInSearchParams: true
      },
      designationId: {
        value: '',
        show: true,
        key: 'designationId',
        includeInSearchParams: true
      },
      deptId: {
        value: '',
        show: true,
        key: 'deptId',
        includeInSearchParams: true
      },
      vendorId: {
        value: '',
        show: true,
        key: 'vendorId',
        includeInSearchParams: true
      },
     
    };
  
    constructor(
      private masterDataService: MasterDataService,
      public dataService: DataService
    ) {
      this.dataService.asyncGetUser().then((user: any) => {
        this.user = user;
        this.userAccessLevel = user.role;
        console.log('User Access Level:', this.userAccessLevel);
      });
    }
  
    ngOnInit(): void {
  
    }
  
    
    onFilterChanged(event: any) {
      console.log('Filters updated in parent component:', this.filters);
      this.getUnits();
    }
  
    search() {
      this.getUnits();
    }
  
    getUnits() {
      const payload = this.dataService.getPayloadValue(this.filters);
  
      this.masterDataService.getUnitWiseReport(payload).subscribe(
        (response:any)=>{
          this.Units = response.data;
        }
      );
    }
  
    openAnalysis(unit: any) {
      this.modalAnalysis.show = true;
      this.modalAnalysis.unit = unit;
    }
  
    closeAnalysis() {
      this.modalAnalysis.show = false;
      this.modalAnalysis.unit =  new UnitReports();
    }
  
    generateAnalysis() {
      const unit = this.modalAnalysis.unit;
    
      if (!unit.TotalEmployees || unit.TotalEmployees === 0) {
        console.warn('Total Employees cannot be zero.');
        return;
      }
    
      // Get the average salary per employee
      const averageSalary = unit.OverallSalarySum / unit.TotalEmployees;
    
      // Ensure the user enters a valid number
      const newEmployeeCount = unit.newEmployeeCount || 0;
    
      // Calculate the new salary sum
      unit.generatedSalarySum = unit.OverallSalarySum + (averageSalary * newEmployeeCount);
    
      console.log('New Generated Salary Sum:', unit.generatedSalarySum);
    }
    

}
