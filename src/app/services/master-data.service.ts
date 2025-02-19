import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { DataService } from '../data.Service';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  private user: any;
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private  dataService:DataService
    ) {
 
  }


  fetchMedicalColleges(): Observable<any> {
    return this.http.get(`${this.apiUrl}master/medical-colleges?skipSetAuth=true`);
  }

  fetchIfpuData(): Observable<any> {
    return this.http.get(`${this.apiUrl}master/ifpu-data?skipSetAuth=true`);
  }

  fetchFsuData(): Observable<any> {
    return this.http.get(`${this.apiUrl}master/fsu-data?skipSetAuth=true`);
  }

  fetchSfuData(): Observable<any> {
    return this.http.get(`${this.apiUrl}master/sfu-data?skipSetAuth=true`);
  }

  registerUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}master/register?skipSetAuth=true`, formData);
  }

  insertUpdateState(data: { stateName: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}master/InsertUpdateState?skipSetAuth=true`, data);
  }
  
  

  getStates():Observable<any>{
    return this.http.get(`${this.apiUrl}Master/GetStateList`);
  }


  getCity(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Master/GetCityList?${queryParams}`;
    return this.http.get(url);
  }

  getcitylist():Observable<any>{
    return this.http.get(`${this.apiUrl}Master/GetCityList`);
  }
  
  

  getCategory():Observable<any>{
    return this.http.get(`${this.apiUrl}Master/GetCategoryList`);
  }

  getDepartment(): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/GetDepartmentList`);
  }

  getCompany(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Master/GetCompanyList?${queryParams}`);
  }

  saveCompany(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/InsertUpdateCompany`, payload);
  }

  getCompanylist(): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/GetCompanyList`);
  }

  getDesignation(): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/GetDesignationsList`);
  }

  getVendors(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Master/GetVendorsList?${queryParams}`);
  }

  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}Employee/GetEmployees`);
  }

  saveEmployee(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Employee/InsertUpdateEmployee`, query);
  }

  saveodslip(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/InsertUpdateODSLIP`, query);
  }
  savedegree(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/SaveDegree`, query);
  }
  getdegree(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/Get_Degree`+query);
  }
  // uploadMultipleCertificates(query: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}Employee/UploadEmpCertificates`, query);
  // }

  // uploadMultipleCertificates(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiUrl}Employee/UploadEmpCertificates`, formData, {
  //     reportProgress: true,
  //     observe: 'events',
  //   });
  // }

  uploadMultipleCertificates(formData: FormData, payload:any): Observable<any> {
    const buildQueryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Employee/UploadEmpCertificates?${buildQueryParams}`;

    return this.http.post(url, formData, {
      headers: new HttpHeaders()
    });
  }

  deleteEmpDoc(payload: any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Employee/DeleteEmpDoc?${queryParams}`;
    return this.http.post(url,{});
  }
  
  
  deleteDesignationQualifications(id: any): Observable<any> {
    const url = `${this.apiUrl}Master/Delete_Designation_Qualification/${id}`;
    return this.http.delete(url);
  }

  deleteDegree(degreeId:any): Observable<any>{
    const url = `${this.apiUrl}Master/DeleteDegree/${degreeId}`;
    return this.http.post(url,{});
  }

  save_Designation_Qualification(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/Save_Designation_Qualification`, payload);
  }

  save_Designation(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/InsertUpdateDesignation`, payload);
  }

  get_Designation_Qualification(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/Get_Designation_Qualification`+query);
  }


  getEmployeeList(query:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(query);
    return this.http.get(`${this.apiUrl}Employee/GetEmployees?${queryParams}`);
  }
  viewcertificate(query:any): Observable<any> {
    const buildQueryParams = this.dataService.buildQueryParams(query);
    return this.http.get(`${this.apiUrl}Employee/GetUploadedCertificates?${buildQueryParams}`);
  }
  getpayslipList(query:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(query);
    return this.http.get(`${this.apiUrl}payroll/getpaysliprecords?${queryParams}`);
  }
  payslips(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}payroll/getpayslipbyEmpId`+query);
  }
  payslipdetails(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Payroll/ViewPayslip`+query);
  }

  generatePay(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.post(`${this.apiUrl}payroll/generatePayslip?${queryParams}`,{});
  }

  generatePayAll(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.post(`${this.apiUrl}payroll/GenerateAllPayslip?${queryParams}`,{});
  }

  getShifts(): Observable<any> {
    return this.http.get(`${this.apiUrl}Shift/GetShifts`);
  }
  
  getODComapnyList(query:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(query);
    return this.http.get(`${this.apiUrl}Master/ODslip_company?${queryParams}`);
  }

  getODDetails(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/ODslip_View`+query);
  }

  LeaveRequest_View(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/LeaveRequest_View`+query);
  }
  
  saveLeaveRequest(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/InsertUpdateLeaveRequest`, query);
  }

  getLeaveRequest(query:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(query);
    return this.http.get(`${this.apiUrl}Master/LeaveRequest_View?${queryParams}`);
  }

  getCompensationRequests(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Master/GetCompensationRequests?${queryParams}`);
  }

  saveCompensationRequest(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/CreateCompensateRequest`, payload);
  }

  updateCompensationRequest(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/ApproveCompensateRequest`, payload);
  }
  
  approveODSlip(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/UpdateODSLIP`, query);
  }

  approveLeaveRequest(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/UpdateLeaveRequest_ApprovalStatus`, query);
  }

  getEmpPayDetails(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Employee/GetEmpPayDetails?${queryParams}`);
  }
  saveBankDetails(payload:any): Observable<any> {
    return this.http.post(`${this.apiUrl}Employee/InsertUpdateEmpPayDetail`, payload);
  }
  updateTotalWages(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.post(`${this.apiUrl}Payroll/InsertSalaryStructure?${queryParams}`, {});
  }

  updateOtherDeductions(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.post(`${this.apiUrl}Payroll/UpdateOtherDeductions?${queryParams}`, {});
  }

  getPassbooks(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Employee/GetUploadedPassbook?${queryParams}`);
  }

 
  uploadPassbook(formData: FormData, payload: any): Observable<any> {
    const buildQueryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Employee/UploadPassbook?${buildQueryParams}`;
  
    return this.http.post(url, formData, {
      headers: new HttpHeaders()
    });
  }


  getUnitWiseReport(payload:any){
    const queryParams = this.dataService.buildQueryParams(payload);
    const url = `${this.apiUrl}Dashboard/GetUnitWiseReport?${queryParams}`;
    return this.http.get(url);
  }
  

  getEmployeePayment(payload:any): Observable<any> {
    const queryParams = this.dataService.buildQueryParams(payload);
    return this.http.get(`${this.apiUrl}Payroll/EmployeePayment?${queryParams}`);
  }

  updateEmployeePayment(payload:any): Observable<any>{
    const url = `${this.apiUrl}Payroll/UpdateEmployeePayment`;
    return this.http.post(url,payload);
  }

  fetchSalaryStructure(empId:any) : Observable<any>{
    const url = `${this.apiUrl}Payroll/GetSalStructByEmpId?empId=${empId}`;
    return this.http.get(url);
  }
}
