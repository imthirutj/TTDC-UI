import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from '../services/master-data.service';
import { LoginService } from './login.service';
import { DataService } from '../data.Service';

import { SnackBarComponent } from '../utils/widgets/snack-bar/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Define the form group
  users: any = {};
  userTypes: any ={};

  constructor(private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private loginService: LoginService,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private router: Router,) {

      this.userTypes = dataService.userTypes;
     }

  ngOnInit(): void {
    // Initialize the form group with controls and validators
    this.loginForm = this.fb.group({
      // userType:['', Validators.required],
      username: ['', Validators.required], // Add validation
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }



  navigateToRegister(): void {
    this.router.navigate(['/register']); 
  }


  login(): void {
    if (this.loginForm.valid) {
      var payload = this.loginForm.value;

      this.loginService.validate(payload).subscribe(
        (response: any) => {
          console.log(response);
          if(response.success){
            const rememberMe = this.loginForm.get('rememberMe')?.value;

            this.dataService.setAuthTokenAndUser(response.token,response.data, rememberMe);
            this.router.navigate(['/dashboard']);
          }
          else {
            this.snackBar.openFromComponent(SnackBarComponent, {
              data: { message: response.message },  // Pass dynamic message
              duration: 5000
            });
          }

        },
        (error) => {
          console.error('Invalid Credentials', error);
          this.snackBar.openFromComponent(SnackBarComponent, {
            data: { message: 'Invalid Credentials' },  // Pass dynamic message
            duration: 5000
          });
        }
      );
    }
  }



}
