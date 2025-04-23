import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { UserType } from './common/user-type.enum';
import { UnitsComponent } from './units/units.component';
import { StateComponent } from './state/state.component';
import { ListComponent } from './state/list/list.component';
import { CityComponent } from './city/city.component';
import { CategoryComponent } from './category/category.component';
import { DepartmentComponent } from './department/department.component';
import { CompanyComponent } from './company/company.component';
import { DesignationComponent } from './designation/designation.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { PayslipRecordsComponent } from './payslip/payslip-records/payslip-records.component';
import { PaySlipComponent } from './payslip/pay-slip/pay-slip.component';
import { PayslipNotComponent } from './payslip/payslip-not/payslip-not.component';
import { EmployeeShiftCalendarComponent } from './employee-shift-calendar/employee-shift-calendar.component';
import { EmployeeWorkDetailsComponent } from './employee-work-details/employee-work-details.component';
import { OdslipComponent } from './odslip/odslip.component';
import { ErrorComponent } from './error/error.component';
import { VendorPaymentDetailsComponent } from './vendor/vendor-payment-details/vendor-payment-details.component';
import { CompanylistComponent } from './odslip/companylist/companylist.component';
import { LeaverequestComponent } from './leaverequest/leaverequest.component';
import { ViewComponent } from './leaverequest/view/view.component';
import { OdslipapprovalComponent } from './odslipapproval/odslipapproval.component';
import { OdapprovalviewComponent } from './odslipapproval/odapprovalview/odapprovalview.component';
import { LeaveapprovalComponent } from './leaveapproval/leaveapproval.component';
import { LeaveapprovalupdateComponent } from './leaveapproval/leaveapprovalupdate/leaveapprovalupdate.component';
import { VendorInvoiceDetailsComponent } from './vendor/vendor-invoice-details/vendor-invoice-details.component';
import { DegreeComponent } from './degree/degree.component';
import { DesignationQualificationComponent } from './designation-qualification/designation-qualification.component';
import { VendorManagementComponent } from './vendor/vendor-management/vendor-management.component';
import { VendorToEmployeePaymentsComponent } from './vendor/vendor-to-employee-payments/vendor-to-employee-payments.component';
import { EmployeeWorkReportComponent } from './employee-work-report/employee-work-report.component';
import { MyProfileComponent } from './employee/my-profile/my-profile.component';
import { HolidayManagementComponent } from './holiday-management/holiday-management.component';
import { CompensateRequestComponent } from './compensate-request/compensate-request.component';
import { ManagerEmployeePaymentEntryComponent } from './manager-employee-payment-entry/manager-employee-payment-entry.component';
import { PayrollExpenditureComponent } from './payroll-expenditure/payroll-expenditure.component';
import { FuturePayrollNeedsComponent } from './future-payroll-needs/future-payroll-needs.component';
import { LeaveAndOdAnalysisComponent } from './leave-and-od-analysis/leave-and-od-analysis.component';
import { EmployeeBasedReportsComponent } from './employee-based-reports/employee-based-reports.component';
import { DashboardEmployeeReportComponent } from './dashboard-employee-report/dashboard-employee-report.component';
import { DashboardEmployeeLineListComponent } from './dashboard-employee-line-list/dashboard-employee-line-list.component';
import { sample } from 'rxjs';
import { SampePageComponent } from './sampe-page/sampe-page.component';
import { DesignationReportComponent } from './reports/designation-report/designation-report.component';
import { DepartmentReportComponent } from './reports/department-report/department-report.component';
import { UnitReportComponent } from './reports/unit-report/unit-report.component';
import { Vendor } from './utils/interface/vendor';
import { VendorReportComponent } from './reports/vendor-report/vendor-report.component';
import { RegionReportComponent } from './reports/region-report/region-report.component';
import { LogNotLogReportComponent } from './reports/log-not-log-report/log-not-log-report.component';
import { LeaveReportComponent } from './reports/leave-report/leave-report.component';
import { OdReportComponent } from './reports/od-report/od-report.component';
import { EmpMinQualReportComponent } from './reports/emp-min-qual-report/emp-min-qual-report.component';
import { ShiftReportComponent } from './reports/shift-report/shift-report.component';
import { SalarySummaryComponent } from './reports/salary-summary/salary-summary.component';
import { PfGenerationReportComponent } from './pf-generation-report/pf-generation-report.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
     canActivate: [AuthGuard],
    data: {  roles: ['ALL'] }, 
  },
  {
    path: 'dashboard-employee-report',
    component: DashboardEmployeeReportComponent,
     canActivate: [AuthGuard],
    data: {  roles: ['ALL'] }, 
  },
  {
    path: 'dashboard-employee-line-list',
    component: DashboardEmployeeLineListComponent,
     canActivate: [AuthGuard],
    data: {  roles: ['ALL'] }, 
  },
  {
    path: 'savestate',
    component: StateComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'state',
    component: ListComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'city',
    component: CityComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'vendor-management',
    component: VendorManagementComponent,
    canActivate: [AuthGuard],
    data: {  roles: [UserType.STATE_ADMIN, UserType.VENDOR, UserType.MANAGER]},
  },
  {
    path: 'department',
    component: DepartmentComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'designation',
    component: DesignationComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'holiday-mgmt',
    component: HolidayManagementComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'employee',
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'payslip-records',
    component: PayslipRecordsComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'payslip-records-waiting',
    component: PayslipNotComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'payslip/:payId',
    component: PaySlipComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'odslip',
    component: OdslipComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'odslipcompanylist',
    component: CompanylistComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'odslipapproval',
    component: OdslipapprovalComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'odslipapprovalview',
    component: OdapprovalviewComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'compensation-request',
    component: CompensateRequestComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'empleaverequest',
    component: LeaverequestComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'leaverequestview',
    component: ViewComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'Leaveapproval',
    component: LeaveapprovalComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'Leaveapprovalview',
    component: LeaveapprovalupdateComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'degree',
    component: DegreeComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'DesignationQualification',
    component: DesignationQualificationComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },

  {
    path: 'vendor-invoice-details',
    component: VendorInvoiceDetailsComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path: 'shift-management',
    component: EmployeeShiftCalendarComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserType.STATE_ADMIN ,UserType.CITY_ADMIN , UserType.MANAGER] },
  },

  {
    path:'employee-report',
    component:EmployeeWorkDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserType.STATE_ADMIN ,UserType.MANAGER] },
    
  },
  {
    path:'employee-work-report',
    component:EmployeeWorkReportComponent,
    canActivate: [AuthGuard],
    data: { roles: [UserType.STATE_ADMIN,UserType.CITY_ADMIN ,UserType.MANAGER, UserType.EMPLOYEE] },
  },
  {
    path: 'vendor-payment-details',
    component: VendorPaymentDetailsComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'vendor-employee-payment-details',
    component:VendorToEmployeePaymentsComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'manager-employee-payment',
    component:ManagerEmployeePaymentEntryComponent,
    canActivate:[AuthGuard],
    data:{roles:['ALL']}
  },
  {
    path:'my-profile',
    component:MyProfileComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'payroll-expenditure',
    component:PayrollExpenditureComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'future-payroll-needs',
    component:FuturePayrollNeedsComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'leave-and-od-analysis',
    component:LeaveAndOdAnalysisComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'employee-based-reports',
    component:EmployeeBasedReportsComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'designation-wise-report',
    component:DesignationReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'section-wise-report',
    component:DepartmentReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'unit-wise-report',
    component:UnitReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'vendor-wise-report',
    component:VendorReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'region-wise-report',
    component:RegionReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'emp-min-qual-report',
    component:EmpMinQualReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },

  {
    path:'loggedin-notloggedin-report',
    component:LogNotLogReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'leave-report',
    component:LeaveReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'od-report',
    component:OdReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'shift-report',
    component:ShiftReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'salary-summary-report',
    component:SalarySummaryComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {
    path:'pf-report',
    component:PfGenerationReportComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },

  {
    path:'sample',
    component:SampePageComponent,
    canActivate: [AuthGuard],
    data: {  roles: ['ALL'] },
  },
  {path:'error', component:ErrorComponent},
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' },

  
  // Add more routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
