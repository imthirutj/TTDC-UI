import { Component } from '@angular/core';
import { MasterDataService } from 'src/app/services/master-data.service';
import { DataService } from 'src/app/data.Service';
import { Employee } from 'src/app/utils/interface/Employee';
import { Vendor } from 'src/app/utils/interface/vendor';
import { Category, City, Company, Department, Designation } from 'src/app/utils/interface/masters';
import { UserType } from 'src/app/common/user-type.enum';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {

    UserType = UserType;
  user: any;
  userAccessLevel: any;

  Employees: any[] = [];


   dropdowns = {
      cities: [] as City[],
      companies: [] as Company[],
      departments: [] as Department[],
      vendors:[] as Vendor[],
      designation: [] as Designation[],
      category: [] as Category[],
    };

  educertificateimage: any[] = [];

  modal = {
    show: false,
    isEdit: false,
    title: '',
    employee: new Employee(),  // Use the Employee class here
  };

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
    catId: {
      value: '',
      show: true,
      key: 'catId',
      includeInSearchParams: true
    },
    employeeId: {
      value: '',
      show: true,
      key: 'employeeId',
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
    private dataService: DataService
  ) {
    this.dataService.asyncGetUser().then((user: any) => {
      this.user = user;
      this.userAccessLevel = user.role;
      console.log('User Access Level:', this.userAccessLevel);
    });
  }

  ngOnInit(): void {
 
  }

  
  ngAfterViewInit() {
    this.fetchCities();
    this.fetchDepartments();
    this.fetchDesignations();
    this.fetchCategory();
  }

  setValues(){
    if (this.userAccessLevel == UserType.VENDOR) {
      this.modal.employee.vendorId = this.user.vendorId;
    }
    if (this.userAccessLevel == UserType.MANAGER) {
      this.modal.employee.companyId = this.user.companyId;
    }
  }

  //#region Dropdowns
  onCityChange() {
    this.modal.employee.companyId = '';
    this.fetchCompanies(this.modal.employee.cityId);
  }
  onCompanyChange(){
    this.modal.employee.vendorId = '';
    this.fetchVendors(this.modal.employee.companyId, this.modal.employee.departmentId);
  }

  onDepartmentChange(){
    this.fetchVendors(this.modal.employee.companyId, this.modal.employee.departmentId);
  }

  //#endregion

  //#region Fetch
  fetchCities() {
    const payload = this.dataService.getPayloadValue(this.filters);
    this.masterDataService.getCity(payload).subscribe((response) => {
      if (response.success) this.dropdowns.cities = response.data;
    });
  }

  fetchCompanies(cityId: any) {
    const payload = { 
      cityId: cityId,
    };
    this.masterDataService.getCompany(payload).subscribe((response) => {
      if (response.success) this.dropdowns.companies = response.data;
    });
  }

  fetchDepartments() {
    this.masterDataService.getDepartment().subscribe((response) => {
      if (response.success) this.dropdowns.departments = response.data;
    });
  }

  fetchVendors(companyId: any, departmentId: any) {
    const payload = { 
      companyId: companyId,
      departmentId: departmentId
    };
    this.masterDataService.getVendors(payload).subscribe((response) => {
      if (response.success) this.dropdowns.vendors = response.data;
    });
  }

  fetchDesignations(){
    this.masterDataService.getDesignation().subscribe((response) => {
      if (response.success) this.dropdowns.designation = response.data;
    });
  }

  fetchCategory(){
    this.masterDataService.getCategory().subscribe((response) => {
      if (response.success) this.dropdowns.category = response.data;
    });
  }
  //#endregion

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.getEmployeeList();
  }

  search() {
    this.getEmployeeList();
  }

  getEmployeeList(): void {
    const payload = this.dataService.getPayloadValue(this.filters);

    this.masterDataService.getEmployeeList(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success && Array.isArray(response.data)) {
          this.Employees = response.data;
        } else {
          this.Employees = [];
          this.dataService.showSnackBar(response.message);
        }
      }
    );
  }


  openModal(isEdit: boolean, employee?: Employee): void {
    this.modal.show = true;
    this.modal.isEdit = isEdit;
    this.modal.title = isEdit ? 'Edit Employee' : 'Add Employee';
    if(isEdit) {
      if(employee){
        this.modal.employee = { ...employee, loginName: 'qwerty', loginPassword: '12345'};

        if(this.modal.employee.cityId){
          this.fetchCompanies(this.modal.employee.cityId);
        }
        if(this.modal.employee.companyId){
          this.fetchVendors(this.modal.employee.companyId, this.modal.employee.departmentId);
        }
      }
    }
    else{
      this.modal.employee = new Employee();
      this.setValues();
    }
  }

  saveEmployee(): void {
    console.log(this.modal.employee);
    this.masterDataService.saveEmployee(this.modal.employee).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          alert('Employee updated successfully.');
          this.getEmployeeList(); // Refresh the list
        } else {
          alert(response.message || 'Failed to update Employee.');
        }
      }
    );
  }

  closeModal(){
    this.modal.show = false;
    this.modal.isEdit = false;
    this.modal.title = '';
    this.modal.employee = new Employee();
  }
  educationCertificateImage(event: any): void {
    const files = event.target.files;
    console.log(this.modal.employee.employeeId, "employeeId");
    if (files.length === 0) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('certificateImage', files[i], files[i].name);
    }

    this.masterDataService.uploadMultipleCertificates(formData, this.modal.employee.employeeId.toString()).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          alert('Certificates uploaded successfully.');
        } else {
          alert(response.message || 'Failed to upload certificates.');
        }
      }
    );
  }

  show_Edu_Certificate(obj_clicked: any) {
    this.modal.employee = obj_clicked;
    this.masterDataService.vieweducertificate('?EmpId=' + obj_clicked.employeeId).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response?.success && Array.isArray(response.data)) {
          this.educertificateimage = response.data;
        } else {
          alert(response?.message || 'Failed to fetch Department list.');
        }
      }
    );
  }
}
