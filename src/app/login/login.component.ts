import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from '../services/master-data.service';
import { LoginService } from './login.service';
import { DataService } from '../data.Service';

import { SnackBarComponent } from '../utils/widgets/snack-bar/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  mobileLoginForm!: FormGroup;
  otpForm!: FormGroup;

  users: any = {};
  userTypes: any = {};

  visibleForm: 'MOBILE' | 'OTP' = 'MOBILE';

  // Timer variables
  remainingTime: number = 300; // 5 minutes in seconds
  timer: any;
  isTimeOver: boolean = false;

  returnUrl: string = '/';

  selectedRoleId: string = '';

  constructor(private fb: FormBuilder,
    private masterDataService: MasterDataService,
    private loginService: LoginService,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) {

    this.userTypes = dataService.userTypes;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });

    // Initialize the form group with controls and validators

    this.loginForm = this.fb.group({
      rememberMe: [false],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.mobileLoginForm = this.fb.group({
      rememberMe: [false],
      MobileNo: ['', Validators.required],
    });
    this.otpForm = this.fb.group({
      OTP: ['', Validators.required],
    });

    let user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    if (user && Object.keys(user).length > 0) {
      this.router.navigate(['/dashboard']);
    }
  }


  ngOnDestroy(): void {
    // Clear the timer when the component is destroyed to prevent memory leaks
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.isTimeOver = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  // Helper function to pad single digits with a leading zero
  pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  goBack(): void {
    this.visibleForm = 'MOBILE';  // Show mobile number form again
    this.remainingTime = 300;  // Reset timer
    this.isTimeOver = false;  // Reset timeout state
    if (this.timer) {
      clearInterval(this.timer); // Stop the current timer
    }
  }


  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  generateOTP(): void {
    if (this.mobileLoginForm.get('MobileNo')?.valid) {
      var payload = {
        mobileNo: this.mobileLoginForm.get('MobileNo')?.value
      };
      console.log(payload);
      this.loginService.generateOTP(payload).subscribe(
        (response: any) => {
          console.log(response);
          if (response.success) {
            this.dataService.showSnackBar(response.message);
            this.visibleForm = 'OTP';
            this.startTimer();
          }
          else {
            this.dataService.showSnackBar(response.message);
          }
        });
    }
    else {
      this.dataService.showSnackBar('Please enter valid mobile number');
    }
  }

  login(): void {
    var payload:any ={
      myRoleId: this.selectedRoleId
    };
    if (this.selectedRoleId =='4') {
      if(!this.otpForm.valid){
        this.dataService.showSnackBar('Please enter valid OTP');
        return;
      }
      if (!this.mobileLoginForm.valid) {
        this.dataService.showSnackBar('Please again enter the mobile number');
        return;
      }
      payload.mobileNo= this.mobileLoginForm.get('MobileNo')?.value;
      payload.otp= this.otpForm.get('OTP')?.value;
    }
    else{
      payload.username= this.loginForm.get('username')?.value;
      payload.password= this.loginForm.get('password')?.value;

      if (!this.loginForm.valid) {
        this.dataService.showSnackBar('Please  enter username and password');
        return;
      }
    }
    
  
    console.log(payload)
    this.loginService.validate(payload).subscribe(
      (response: any) => {
        console.log(response);
        if (response.success) {
          const rememberMe = this.loginForm.get('rememberMe')?.value;

          this.dataService.setAuthTokenAndUser(response.token, response.data, rememberMe);

          // Check if returnUrl is set to '/' and update to '/dashboard' if so
          if (this.returnUrl === '/' ) {
            this.returnUrl = '/dashboard'; // Default fallback
          }else{
            if(this.returnUrl.includes('/payslip/')){ 
              
            }
            else{
              this.returnUrl = '/dashboard';
            }
          }

          // Parse the returnUrl to get path and query parameters
          const { path, queryParams } = this.dataService.parseUrl(this.returnUrl);

          // Default to dashboard if no returnUrl
          if (path === '/') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate([path], { queryParams });
          }
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
