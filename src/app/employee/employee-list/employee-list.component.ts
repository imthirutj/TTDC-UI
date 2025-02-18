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

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {

  Action = Action;
  ModuleType = ModuleType;
  ModuleTypeLabels = ModuleTypeLabels;
  UserType = UserType;
  user: any;
  userAccessLevel: any;

  Employees: any[] = [];



  pageAttributes = {
    currentPage: 1,
    totalPages: 1,
    pageSize:10
  }

  dropdowns = {
    cities: [] as City[],
    companies: [] as Company[],
    departments: [] as Department[],
    vendors: [] as Vendor[],
    designation: [] as Designation[],
    category: [] as Category[],
    degree: [] as any[]
  };

  educertificateimage: any[] = [];

  modal = {
    action: Action.NONE,
    module: ModuleType.NONE,
    show: false,
    isEdit: false,
    title: '',
    employee: new Employee(),  // Use the Employee class here
  };

  bankModal = {
    show: false,
    title: '',
    bankDetails: new BankDetails()
  }

  formData = new FormData();



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
      show: false,
      key: 'employeeId',
      includeInSearchParams: false
    },
    employeeName: {
      value: '',
      show: true,
      key: 'employeeName',
      includeInSearchParams: true
    },
    employeeCode: {
      value: '',
      show: true,
      key: 'employeeCode',
      includeInSearchParams: true
    },
    vendorId: {
      value: '',
      show: true,
      key: 'vendorId',
      includeInSearchParams: true
    },
    qualificationMismatched:{
      value: '0',
      show: true,
      key: 'qualificationMismatched',
      includeInSearchParams: true
    }
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
    this.fetchDegree();
  }

  setValues() {
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
  onCompanyChange() {
    this.modal.employee.vendorId = '';
    this.fetchVendors(this.modal.employee.companyId, this.modal.employee.departmentId);
  }

  onDepartmentChange() {
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

  fetchDesignations() {
    this.masterDataService.getDesignation().subscribe((response) => {
      if (response.success) this.dropdowns.designation = response.data;
    });
  }

  fetchCategory() {
    this.masterDataService.getCategory().subscribe((response) => {
      if (response.success) this.dropdowns.category = response.data;
    });
  }

  fetchDegree() {
    this.masterDataService.getdegree("").subscribe((response) => {
      if (response.success) {
        this.dropdowns.degree = response.data;
      }
    });
  }
  //#endregion

  onFilterChanged(event: any) {
    console.log('Filters updated in parent component:', this.filters);
    this.pageAttributes.currentPage = 1;
    this.getEmployeeList();
  }

  search() {
    this.getEmployeeList();
  }

  getEmployeeList(): void {
    const payload = this.dataService.getPayloadValue(this.filters);
    const fpayload = {
      ...payload,
      pageNumber: this.pageAttributes.currentPage,
    }
    this.masterDataService.getEmployeeList(fpayload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.Employees = response.data;
          this.pageAttributes.totalPages = response.totalPages;
          // Loop through each employee and process their qualifications
          this.Employees.forEach((employee: any) => {
            // Format qualifications if requiredQualifications exist
            if (Array.isArray(employee.requiredQualifications)) {
              const degrees = employee.requiredQualifications
                .map((q: any) => q.degreeName)
                .filter((name: string) => name) // Remove empty degree names
                .join(', ');

              const experience = employee.minimumExpYears > 0 ? ` & ${employee.minimumExpYears} Years` : '';

              employee.formattedQualifications = degrees ? `${degrees}${experience}` : '';
            } else {
              employee.formattedQualifications = '';
            }

            // Check if the employee's qualifications do not match the required qualifications
            if (employee.requiredQualifications && employee.requiredQualifications.length > 0
              && employee.degreeId && employee.experience
            ) {
              employee.notMatchedQualification = true;
              // Check if employee.degreeId exists in the requiredQualifications list
              const hasMatchingDegree = employee.requiredQualifications.some(
                (q: any) => q.degreeId === employee.degreeId
              );

              // If there is a matching degree and experience is sufficient, set notMatchedQualification to false
              if (hasMatchingDegree && employee.experience >= employee.minimumExpYears) {
                employee.notMatchedQualification = false;
              }
            } else {
              employee.notMatchedQualification = true;
            }


            console.log('Status', employee.notMatchedQualification);
          });




        } else {
          this.Employees = [];
          this.dataService.showSnackBar(response.message);
        }
      }
    );
  }


  // paginate(): void {
  //   const startIndex = (this.pageAttributes.currentPage - 1) * this.pageAttributes.itemsPerPage;
  //   const endIndex = startIndex + this.pageAttributes.itemsPerPage;
  //   this.Employees = this.allEmlpoyees.slice(startIndex, endIndex);
  // }



  openModal(action: Action, employee?: Employee): void {
    this.modal.show = true;
    this.modal.action = action;
    this.modal.module = ModuleType.EMPLOYEE;
    this.modal.title = action == Action.UPDATE ? 'Edit Employee' : action == Action.CREATE ? 'Add Employee' : 'View Employee';
    if (action == Action.UPDATE || action == Action.VIEW) {
      if (employee) {
        this.modal.employee = { ...employee, loginName: 'qwerty', loginPassword: '12345' };

        if (this.modal.employee.cityId) {
          this.fetchCompanies(this.modal.employee.cityId);
        }
        if (this.modal.employee.companyId) {
          this.fetchVendors(this.modal.employee.companyId, this.modal.employee.departmentId);
        }
      }
    }
    else {
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
          this.dataService.showSnackBar('Employee updated successfully.');
          this.modal.show = false;
          this.getEmployeeList(); // Refresh the list
        } else {
          alert(response.message || 'Failed to update Employee.');
        }
      }
    );
  }

  closeModal() {
    this.modal.show = false;
    this.modal.module = ModuleType.EMPLOYEE;
    this.modal.action = Action.NONE;
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

    this.formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      this.formData.append('certificateImage', files[i], files[i].name);
    }
  }

  uploadCertificate() {
    const payload = {
      empId: this.modal.employee.employeeId,
      docType: this.modal.module
    };
    this.masterDataService.uploadMultipleCertificates(this.formData, payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Certificates uploaded successfully.');
          this.show_Certificate(this.modal.employee, this.modal.module);
        } else {
          this.dataService.showSnackBar(response.message || 'Failed to upload certificates.');
        }
      }
    );
  }

  deleteEmpDoc(obj: any) {
    const payload = {
      docId: obj.docId
    }
    this.masterDataService.deleteEmpDoc(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Certificates deleted successfully.');
          this.show_Certificate(this.modal.employee, this.modal.module);
        } else {
          this.dataService.showSnackBar(response.message || 'Failed to delete certificates.');
        }
      }
    );
  }

  show_Certificate(obj_clicked: any, moduleType: ModuleType) {
    this.modal.show = true;
    this.modal.module = moduleType;
    this.modal.title = ModuleTypeLabels[moduleType];
    this.modal.employee = obj_clicked;
    const payload = {
      empId: obj_clicked.employeeId,
      docType: moduleType
    }
    this.educertificateimage = [] as any[];
    this.masterDataService.viewcertificate(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response?.success && Array.isArray(response.data)) {
          const data = response.data;
          this.educertificateimage = data.filter((doc: any) => doc.docType == moduleType);
        } else {
          this.dataService.showSnackBar(response?.message || 'Failed to fetch list.');
        }
      }
    );
  }


  openBankModal(empId: any) {
    this.bankModal.show = true;
    this.bankModal.title = 'Bank Details';
    const payload = {
      empId: empId
    }
    this.masterDataService.getEmpPayDetails(payload).subscribe(
      (response: any) => {
        if (response.success) {
          if (response.data != null) {
            this.bankModal.bankDetails = response.data;
          }
          else {
            this.bankModal.bankDetails = new BankDetails();
            this.bankModal.bankDetails.employeeId = empId;
          }

        }
      }
    );
  }

  closeBankModal() {
    this.bankModal.show = false;
    this.bankModal.title = '';
  }

  submitBankDetails() {
    this.masterDataService.saveBankDetails(this.bankModal.bankDetails).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Bank Details updated successfully.');
          this.closeBankModal();
        }
      }
    );
  }

  toggleEditWages(employee: any) {
    employee.isEditing = true;
    employee.oldTotalWages = employee.totalWages; // Store old value for cancel functionality
  }
  cancelEdit(employee: any) {
    employee.totalWages = employee.oldTotalWages; // Restore original value
    employee.isEditing = false;
  }

  updateTotalWages(employee: any) {
    var payload = {
      employeeId: employee.employeeId,
      totalWages: employee.totalWages
    };
    this.masterDataService.updateTotalWages(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Total Wages updated successfully.');
          this.getEmployeeList();
        }
      }
    );
  }

  toggleRecordStatus(employee: any) {
    // Toggle the value between 1 and 0
    employee.recordStatus = employee.recordStatus === 1 ? 0 : 1;
  }

  getDegreeNames(employee: any): string {
    return employee.requiredQualifications
      .map((q:any) => q.degreeName)
      .filter((name:any) => name) // Remove null or undefined values
      .join(', ');
  }
  
}
