import { HttpClient } from '@angular/common/http';
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

  getCompanylist(): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/GetCompanyList`);
  }

  getDesignation(): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/GetDesignationsList`);
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


  getEmployeeList(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Employee/GetEmployees`+query);
  }
  getpayslipList(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}payroll/getpaysliprecords`+query);
  }
  payslips(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}payroll/getpayslipbyEmpId`+query);
  }
  payslipdetails(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Payroll/ViewPayslip`+query);
  }

  generatePay(query:any): Observable<any> {
    return this.http.post(`${this.apiUrl}payroll/generatePayslip`+query+``,{});
  }

  getShifts(): Observable<any> {
    return this.http.get(`${this.apiUrl}Shift/GetShifts`);
  }
  
  getODComapnyList(query:any): Observable<any> {
    return this.http.get(`${this.apiUrl}Master/ODslip_company`+query);
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
    return this.http.get(`${this.apiUrl}Master/LeaveRequest_View`+query);
  }
  
  approveODSlip(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/UpdateODSLIP_ApprovalStatus`, query);
  }

  approveLeaveRequest(query: any): Observable<any> {
    return this.http.post(`${this.apiUrl}Master/UpdateLeaveRequest_ApprovalStatus`, query);
  }


}
