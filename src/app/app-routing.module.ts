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



const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {   data: { roles: [UserType.STATE_ADMIN, UserType.DMER_ADMIN, UserType.INSTITUTION_ADMIN] }, },
   },
   { 
    path: 'inst_profile/:institution_id', 
    component: InstitutionProfileComponent,
    canActivate: [AuthGuard],
    data: {   data: { roles: [UserType.STATE_ADMIN, UserType.DMER_ADMIN, UserType.INSTITUTION_ADMIN] }, },
   },

   { 
    path: 'units', 
    component: UnitsComponent,
    canActivate: [AuthGuard],
    data: {   data: { roles: ['ALL'] }, },
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
