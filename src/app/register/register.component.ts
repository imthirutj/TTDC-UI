import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from '../services/master-data.service';
import { DataService } from '../data.Service';
import { DropdownConfigService } from '../utils/shared/dropdown-config.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLogin: boolean = true; // Toggle state for login/register
  userTypes: any[] = []; // Will be fetched from DataService
  genderTypes: string[] = []; // Will be fetched from DataService
  
  // Declare arrays for fetched data
  medicalColleges: any[] = [];
  ifpuData: any[] = [];
  fsuData: any[] = [];
  sfuData: any[] = [];

    // Declare arrays for filtered data
    filteredMedicalColleges: any[] = [];
    filteredIfpuData: any[] = [];
    filteredFsuData: any[] = [];
    filteredSfuData: any[] = [];

    
  passwordMismatch: boolean = false;
  passwordTooLong: boolean = false;

 


  constructor(
    private fb: FormBuilder,
    public dropDownConfigService: DropdownConfigService,
    private masterDataService: MasterDataService,
    private dataService: DataService,  // Injected service
  ) {
    // Define the reactive form
    this.registerForm = this.fb.group({
      userType: ['', Validators.required],
      medicalCollege: [''],
      ifpuData: [''],
      fsuData: [''],
      sfuData: [''],
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      department: ['', Validators.required],
      genderType: ['', Validators.required],
      photo: ['']
    });
  }

  ngOnInit(): void {
    // Set the user types and gender types from DataService
    this.userTypes = this.dataService.userTypes;
    this.genderTypes = this.dataService.genderTypes;
  }


  // Handle user type change and fetch corresponding data
  // Handle user type change and fetch corresponding data
  onUserTypeChange(): void {
    const userType = this.registerForm.get('userType')?.value;
    switch (userType) {
      case 'INSTITUTION_ADMIN':
        this.masterDataService.fetchMedicalColleges().subscribe(
          (response: any) => {
            this.medicalColleges = response.data;
            this.filteredMedicalColleges = this.medicalColleges;  // Initialize filter
          },
          (error) => {
            console.error('Error fetching medical colleges:', error);
          }
        );
        break;
      case 'IFPU':
        this.masterDataService.fetchIfpuData().subscribe(
          (response: any) => {
            this.ifpuData = response.data;
            this.filteredIfpuData = this.ifpuData;
          },
          (error) => {
            console.error('Error fetching IFPU data:', error);
          }
        );
        break;
      case 'FSU':
        this.masterDataService.fetchFsuData().subscribe(
          (response: any) => {
            this.fsuData = response.data;
            this.filteredFsuData = this.fsuData;
          },
          (error) => {
            console.error('Error fetching FSU data:', error);
          }
        );
        break;
      case 'SFU':
        this.masterDataService.fetchSfuData().subscribe(
          (response: any) => {
            this.sfuData = response.data;
            this.filteredSfuData = this.sfuData;
          },
          (error) => {
            console.error('Error fetching SFU data:', error);
          }
        );
        break;
      default:
        break;
    }
  }


  selectionChanged(event: any) {
    console.log('Selected medical college:', event);
  }

  // Validate passwords
  checkPassword(): void {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    this.passwordMismatch = password !== confirmPassword;
    this.passwordTooLong = password.length > 8;
  }

  // Register user
  register(): void {
    this.checkPassword();
    if (this.registerForm.invalid || this.passwordMismatch || this.passwordTooLong) {
      alert('Please fix the form errors before submitting.');
      return;
    }

    const formData = new FormData();
    Object.keys(this.registerForm.controls).forEach((key) => {
      const controlValue = this.registerForm.get(key)?.value;
      if (controlValue) formData.append(key, controlValue);
    });

    const userType = this.registerForm.get('userType')?.value;
    if (userType === 'INSTITUTION_ADMIN') {
      formData.append('MedicalCollegeId', this.registerForm.get('medicalCollege')?.value);
    } else if (userType === 'IFPU') {
      formData.append('IfpuId', this.registerForm.get('ifpuData')?.value);
    } else if (userType === 'FSU') {
      formData.append('FsuId', this.registerForm.get('fsuData')?.value);
    } else if (userType === 'SFU') {
      formData.append('SfuId', this.registerForm.get('sfuData')?.value);
    }

    this.masterDataService.registerUser(formData).subscribe(
      (response: any) => {
        if (response.success) {
          alert('Registration successful!');
        } else {
          alert(response.message || 'Registration failed.');
        }
      },
      (error) => {
        console.error('Error during registration:', error);
      }
    );
  }

  // Handle file input change
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.registerForm.patchValue({ photo: input.files[0] });
    }
  }
}
