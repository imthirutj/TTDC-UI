import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { UserType } from './common/user-type.enum';
import { InstitutionProfileComponent } from './institutions/institution-profile/institution-profile.component';
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
import { ShiftManagementComponent } from './shift-management/shift-management.component';
import { EmployeeShiftCalendarComponent } from './employee-shift-calendar/employee-shift-calendar.component';



const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
    data: { data: { roles: [UserType.STATE_ADMIN, UserType.DMER_ADMIN, UserType.INSTITUTION_ADMIN] }, },
  },
  {
    path: 'inst_profile/:institution_id',
    component: InstitutionProfileComponent,
    // canActivate: [AuthGuard],
    data: { data: { roles: [UserType.STATE_ADMIN, UserType.DMER_ADMIN, UserType.INSTITUTION_ADMIN] }, },
  },

  {
    path: 'units',
    component: UnitsComponent,
    // canActivate: [AuthGuard],
    data: { data: { roles: ['ALL'] }, },
  },

  {
    path: 'savestate',
    component: StateComponent,
  },
  {
    path: 'state',
    component: ListComponent
  },
  {
    path: 'city',
    component: CityComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'department',
    component: DepartmentComponent
  },
  {
    path: 'company',
    component: CompanyComponent
  },
  {
    path: 'designation',
    component: DesignationComponent
  },
  {
    path: 'employee',
    component: EmployeeListComponent
  },
  {
    path: 'payslip-records',
    component: PayslipRecordsComponent
  },
  {
    path: 'payslip-records-waiting',
    component: PayslipNotComponent
  },
  {
    path: 'payslip/:payId',
    component: PaySlipComponent
  },


  {
    path: 'shift-management',
    component: EmployeeShiftCalendarComponent

  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' },
  // Add more routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
