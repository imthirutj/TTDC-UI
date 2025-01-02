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
import { VendorComponent } from './vendor/vendor.component';
import { CompanylistComponent } from './odslip/companylist/companylist.component';

import { LeaverequestComponent } from './leaverequest/leaverequest.component';
import { ViewComponent } from './leaverequest/view/view.component';
import { OdslipapprovalComponent } from './odslipapproval/odslipapproval.component';
import { OdapprovalviewComponent } from './odslipapproval/odapprovalview/odapprovalview.component';
import { LeaveapprovalComponent } from './leaveapproval/leaveapproval.component';
import { LeaveapprovalupdateComponent } from './leaveapproval/leaveapprovalupdate/leaveapprovalupdate.component';
import { VendorInvoiceDetailsComponent } from './vendor-invoice-details/vendor-invoice-details.component';
import { MonthNamePipe } from './utils/pipes/month-name.pipe';
import { DegreeComponent } from './degree/degree.component';
import { DesignationQualificationComponent } from './designation-qualification/designation-qualification.component';


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
    VendorComponent,
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
    FullCalendarModule 
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
