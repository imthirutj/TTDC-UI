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
import { ActivatedRoute } from '@angular/router';
import { PfUpdateService } from 'src/app/pf-update/pf-update.service';

@Component({
  selector: 'app-permanent-employee-list',
  templateUrl: './permanent-employee-list.component.html',
  styleUrls: ['./permanent-employee-list.component.css']
})
export class PermanentEmployeeListComponent {

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
    pageSize: 100
  }
  totalCount: number = 0;
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

  salaryUpdateModal = {
    show: false,
    title: 'Update All Employee Salaries',
    percentage: 0
  }

  formData = new FormData();


  passedFilters: any = {};
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
    employementType:{
      value: '',
      show: true,
      key: 'employementType',
      includeInSearchParams: true
    },
    vendorId: {
      value: '',
      show: true,
      key: 'vendorId',
      includeInSearchParams: true
    },
    qualificationMismatched: {
      value: '0',
      show: false,
      key: 'qualificationMismatched',
      includeInSearchParams: false
    },
    loggedInType: {
      value: '0',
      show: false,
      key: 'loggedInType',
      includeInSearchParams: true
    },
    activeStatus: {
      value: 'ACTIVE',
      show: true,
      key: 'activeStatus',
      includeInSearchParams: true
    }
  };

  constructor(
    private masterDataService: MasterDataService,
    public dataService: DataService,
    private route: ActivatedRoute,
    private pfService: PfUpdateService
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
    this.pageAttributes.currentPage = 1;
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
    this.pageAttributes.currentPage = 1;
    this.getEmployeeList();
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

  modalSalStruct = {
    show: false,
    title: 'Salary Structure',
    obj: new WageDetails()
  }

  openSalStructModal(empId: any) {
    this.modalSalStruct.show = true;
    this.modalSalStruct.obj = new WageDetails();
    this.fetchSalaryStructure(empId);
  }
  closeSalStructModal() {
    this.modalSalStruct.show = false;
    this.modalSalStruct.obj = new WageDetails();
  }
  fetchSalaryStructure(empId: any) {
    this.masterDataService.fetchSalaryStructure(empId).subscribe((response) => {
      if (response.success) {
        this.modalSalStruct.obj = response.data[0];
      }
    })
  }
  //#endregion


  getEmployeeList(): void {
    const payload = this.dataService.getPayloadValue(this.filters);
    const fpayload = {
      ...payload,
      pageNumber: this.pageAttributes.currentPage,
      pageSize: this.pageAttributes.pageSize
    }
    this.Employees = [];
    this.masterDataService.getEmployeeList(fpayload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.Employees = response.data;
          this.pageAttributes.totalPages = response.totalPages;
          this.totalCount = response.totalCount;
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

  openSalaryUpdateModal(): void {
    this.salaryUpdateModal.show = true;
    this.salaryUpdateModal.title = 'Update All Employee Salaries';
    this.salaryUpdateModal.percentage = 0;
  }

  closeSalaryUpdateModal(): void {
    this.salaryUpdateModal.show = false;
    this.salaryUpdateModal.percentage = 0;
  }


  confirmSalaryPercentageUpdate() {
    if (this.salaryUpdateModal.percentage == 0) {
      this.dataService.showSnackBar('Please enter a percentage.');
      return;
    }

    const percentage = this.salaryUpdateModal.percentage;
    const empCount = this.totalCount;
    this.dataService.openConfirmationDialog2({
      title: ``,
      message: `Are you sure Want to Update ${percentage}%  Salary For ${empCount} Employees?`,
      onYes: () => {
        this.updateAllSalaries();
      }
    });
  }
  updateAllSalaries(): void {

    let payload = this.dataService.getPayloadValue(this.filters);
    payload = {
      ...payload,
      salaryPercent: this.salaryUpdateModal.percentage
    }
    this.masterDataService.updateAllEmployeeWages(payload).subscribe(
      (response: any) => {
        this.dataService.showSnackBar(response.message);
        this.closeSalaryUpdateModal();
        this.getEmployeeList(); // Refresh the list
      }
    );
  }

  decrementPercentage() {
    if (this.salaryUpdateModal.percentage > -50) {
      this.salaryUpdateModal.percentage--;
    }
  }

  incrementPercentage() {
    if (this.salaryUpdateModal.percentage < 50) {
      this.salaryUpdateModal.percentage++;
    }
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
          const payload = {
            cityId: this.modal.employee.cityId,
          };
          this.masterDataService.getCompany(payload).subscribe((response) => {
            if (response.success) this.dropdowns.companies = response.data;
            // Ensure the selected companyId is preserved
            if (!this.modal.employee.companyId && this.dropdowns.companies.length > 0) {

            }
          });
        }
        if (this.modal.employee.companyId) {
          this.fetchVendors(this.modal.employee.companyId, this.modal.employee.departmentId);
        }
      }
    }
    else {
      this.modal.employee = new Employee();
      // Ensure dropdowns are loaded first
      setTimeout(() => {
        this.modal.employee.cityId = this.user.cityId;
        if (this.modal.employee.cityId) {
          const payload = {
            cityId: this.modal.employee.cityId,
          };
          this.masterDataService.getCompany(payload).subscribe((response) => {
            if (response.success) this.dropdowns.companies = response.data;
            // Ensure the selected companyId is preserved
            if (!this.modal.employee.companyId && this.dropdowns.companies.length > 0) {
              this.modal.employee.companyId = this.filters.companyId.value;
            }
          });
        }

      }, 500);
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
    return employee?.requiredQualifications
      ? employee.requiredQualifications
        .map((q: any) => q.degreeName)
        .filter((name: any) => name) // Remove null or undefined values
        .join(', ')
      : 'N/A'; // Return 'N/A' if requiredQualifications is null/undefined
  }

  getTotal(obj: any, key: string): number {
    return obj.employees.length;
  }



  modalUniform = {
    show: false,
    title: '',
    empId: null,
    uniforms: [{ id: 0, type: '', qty: null, size: '' }],
  };
  openUniformModal(empId: any) {
    this.modalUniform.show = true;
    this.modalUniform.title = 'Uniform Details';
    this.modalUniform.empId = empId;
    this.modalUniform.uniforms = [{ id: 0, type: '', qty: null, size: '' }];
    const payload = {
      empId: empId
    }
    this.masterDataService.getEmpUniformDetails(payload).subscribe(
      (response: any) => {
        if (response.success) {
          if (response.data != null) {
            this.modalUniform.uniforms = response.data;
          }
        }
      }
    );
  }

  addUniformField() {
    this.modalUniform.uniforms.push({ id: 0, type: '', qty: null, size: '' });
  }

  removeUniformField(index: number) {
    if (this.modalUniform.uniforms.length > 1) {
      this.modalUniform.uniforms.splice(index, 1);
    } else {
      this.dataService.showSnackBar('At least one uniform field is required.');
    }
  }

  closeUniformModal() {
    this.modalUniform.show = false;
    this.modalUniform.title = '';
    this.modalUniform.uniforms = [];
  }

  submitUniformDetails() {
    const empId = this.modalUniform.empId;
    this.masterDataService.saveUniformDetails(this.modalUniform.uniforms, empId).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.dataService.showSnackBar('Uniform Details updated successfully.');
          this.closeUniformModal();
        }
      }
    );
  }


  modalEmpHistory: any = {
    show: false,
    title: 'Employment History',
    empId: null,
    employmentHistory: [],
  };

  openEmploymentHistoryModal(empId: any) {
    this.modalEmpHistory.show = true;
    const payload = {
      empId: empId
    }
    this.masterDataService.getEmpEmploymentHistory(payload).subscribe(
      (response: any) => {
        if (response.success) {
          this.modalEmpHistory.employmentHistory = response.data;
        }
      }
    );
  }


  closeEmpHistoryModal() {
    this.modalEmpHistory.show = false;
    this.modalEmpHistory.title = '';
    this.modalEmpHistory.employmentHistory = [];
  }

  modalEmpPf: any = {
    show: false,
    title: 'Update PF',
    empId: null,
    month: null,
    year: null,
    password: '',
  }

  modalPfPassbook: any = {
    show: false,
    title: 'PF Passbook',
    empId: null,
    pfPassbook: [],
  }

  openPfUpdateModal() {
    this.modalEmpPf.show = true;
    this.modalEmpPf.title = 'Update PF';
    this.modalEmpPf.month = null;
    this.modalEmpPf.year = null;
  }

  closePfUpdateModal() {
    this.modalEmpPf.show = false;
    this.modalEmpPf.title = '';
    this.modalEmpPf.month = null;
    this.modalEmpPf.year = null;
  }

  pfUpdateConfirm() {
    if (!this.modalEmpPf.empId  || !this.modalEmpPf.password) {
      this.dataService.showSnackBar('Please fill all the fields.');
      return;
    }

    this.dataService.openConfirmationDialog2({
      title: ``,
      message: `Are you sure Want to Update PF For ${this.modalEmpPf.empId}?`,
      onYes: () => {
        this.pfUpdate();
      }
    });

  }

  pfUpdate() {
    const payload = {
      empId: this.modalEmpPf.empId,
      month: this.modalEmpPf.month,
      year: this.modalEmpPf.year,
      password: this.modalEmpPf.password
    }
    this.pfService.pfUpdateByEmpId(payload).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.status) {
          this.dataService.showSnackBar('PF updated successfully.');
          this.closePfUpdateModal();
        }
      }
    );

  }

  openPfPassbookModal(empId: any) {
    this.modalPfPassbook.show = true;
    this.modalEmpPf.empId = empId;
    this.getPfData(empId);
  }

  getPfData(empId: any) {
    const payload = {
      empId: empId
    }
    this.masterDataService.getEmpPfPassbook(payload).subscribe(
      (response: any) => {
        if (response.success) {
          this.modalPfPassbook.pfPassbook = response.data;
        }
      }
    );
  }

  closePfPassbookModal() {
    this.modalPfPassbook.show = false;
    this.modalPfPassbook.title = '';
    this.modalPfPassbook.pfPassbook = [];

    this.modalEmpPf.empId = null;
  }
}
