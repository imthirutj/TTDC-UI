import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  // Import this
import { FormsModule } from '@angular/forms'; 
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackBarComponent } from './utils/widgets/snack-bar/snack-bar/snack-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthInterceptor } from './auth.interceptor';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CommonDialogComponent } from './common/common-dialog/common-dialog.component';
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

import { FullCalendarModule } from '@fullcalendar/angular';
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
import { MonthNamePipe } from './utils/pipes/month-name.pipe';
import { DegreeComponent } from './degree/degree.component';
import { DesignationQualificationComponent } from './designation-qualification/designation-qualification.component';
import { FiltersComponent } from './filters/filters.component';
import { MinutesToHoursPipe } from './utils/pipes/minutes-to-hours.pipe';
import { VendorManagementComponent } from './vendor/vendor-management/vendor-management.component';
import { ServerPaginationComponent } from './utils/widgets/server-pagination/server-pagination.component';
import { VendorToEmployeePaymentsComponent } from './vendor/vendor-to-employee-payments/vendor-to-employee-payments.component';


import { NgChartsModule  } from 'ng2-charts';
import { ChartComponent } from './utils/widgets/chart/chart/chart.component';
import { ConfirmationDialogComponent } from './utils/widgets/confirmation-dialog/confirmation-dialog.component';
import { EmployeeWorkReportComponent } from './employee-work-report/employee-work-report.component';
import { MyProfileComponent } from './employee/my-profile/my-profile.component';

import { TopSectionComponent } from './shared/top-section/top-section.component';
import { HolidayManagementComponent } from './holiday-management/holiday-management.component';
import { CompensateRequestComponent } from './compensate-request/compensate-request.component';
import { ManagerEmployeePaymentEntryComponent } from './manager-employee-payment-entry/manager-employee-payment-entry.component';

import { MatSliderModule } from '@angular/material/slider';
import { PayrollExpenditureComponent } from './payroll-expenditure/payroll-expenditure.component';
import { FuturePayrollNeedsComponent } from './future-payroll-needs/future-payroll-needs.component';
import { LeaveAndOdAnalysisComponent } from './leave-and-od-analysis/leave-and-od-analysis.component';
import { EmployeeBasedReportsComponent } from './employee-based-reports/employee-based-reports.component';
import { DashboardEmployeeReportComponent } from './dashboard-employee-report/dashboard-employee-report.component';
import { DashboardEmployeeLineListComponent } from './dashboard-employee-line-list/dashboard-employee-line-list.component';
import { SampePageComponent } from './sampe-page/sampe-page.component';
import { DesignationReportComponent } from './reports/designation-report/designation-report.component';
import { DepartmentReportComponent } from './reports/department-report/department-report.component';
import { UnitReportComponent } from './reports/unit-report/unit-report.component';
import { VendorReportComponent } from './reports/vendor-report/vendor-report.component';
import { RegionReportComponent } from './reports/region-report/region-report.component';
import { LogNotLogReportComponent } from './reports/log-not-log-report/log-not-log-report.component';
import { LeaveReportComponent } from './reports/leave-report/leave-report.component';
import { OdReportComponent } from './reports/od-report/od-report.component';
import { EmpMinQualReportComponent } from './reports/emp-min-qual-report/emp-min-qual-report.component';
import { ShiftReportComponent } from './reports/shift-report/shift-report.component';
import { SalarySummaryComponent } from './reports/salary-summary/salary-summary.component';
import { PfGenerationReportComponent } from './pf-generation-report/pf-generation-report.component';
import { PfUpdateComponent } from './pf-update/pf-update.component';
import { PermanentEmployeeListComponent } from './a-permanent/permanent-employee-list/permanent-employee-list.component';


//Permanent 


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    SnackBarComponent,
    CommonDialogComponent,
    UnitsComponent,
    StateComponent,
    ListComponent,
    CityComponent,
    CategoryComponent,
    DepartmentComponent,
    CompanyComponent,
    DesignationComponent,
    EmployeeListComponent,
    PayslipRecordsComponent,
    PaySlipComponent,
    PayslipNotComponent,
    EmployeeShiftCalendarComponent,
    EmployeeWorkDetailsComponent,
    OdslipComponent,
    ErrorComponent,
    VendorPaymentDetailsComponent,
    CompanylistComponent,
    LeaverequestComponent,    
    ViewComponent,
     OdslipapprovalComponent,
      OdapprovalviewComponent,
       LeaveapprovalComponent,
        LeaveapprovalupdateComponent, 
    VendorInvoiceDetailsComponent,
    MonthNamePipe,
    DegreeComponent,
    DesignationQualificationComponent,
    FiltersComponent,
    MinutesToHoursPipe,
    VendorManagementComponent,
    ServerPaginationComponent,
    VendorToEmployeePaymentsComponent,
    ChartComponent,
    ConfirmationDialogComponent,
    EmployeeWorkReportComponent,
    MyProfileComponent,
    TopSectionComponent,
    HolidayManagementComponent,
    CompensateRequestComponent,
    ManagerEmployeePaymentEntryComponent,
    PayrollExpenditureComponent,
    FuturePayrollNeedsComponent,
    LeaveAndOdAnalysisComponent,
    EmployeeBasedReportsComponent,
    DashboardEmployeeReportComponent,
    DashboardEmployeeLineListComponent,
    SampePageComponent,
    DesignationReportComponent,
    DepartmentReportComponent,
    UnitReportComponent,
    VendorReportComponent,
    RegionReportComponent,
    LogNotLogReportComponent,
    LeaveReportComponent,
    OdReportComponent,
    EmpMinQualReportComponent,
    ShiftReportComponent,
    SalarySummaryComponent,
    PfGenerationReportComponent,
    PfUpdateComponent,


    PermanentEmployeeListComponent

  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule ,
    FormsModule,
    RouterModule,
    FontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    NgSelectModule,
    SelectDropDownModule,
    FullCalendarModule ,
    NgChartsModule ,
    MatSliderModule
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
