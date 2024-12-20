import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.Service';
import { InstitutionsService } from '../institutions.service';
import { NgForm } from '@angular/forms';
import { UserType } from 'src/app/common/user-type.enum';


@Component({
  selector: 'app-institution-profile',
  templateUrl: './institution-profile.component.html',
  styleUrls: ['./institution-profile.component.css']
})
export class InstitutionProfileComponent {
  institution_id!:any;
  my_institution_id!:any;
  userAccessLevel: string = '';

  institution:any = {};
  isEditMode: boolean = false;

  institutionName = 'Dr.ABCD';
  city = 'CityName';


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private institutionsService: InstitutionsService
  ) {
     
  }

  async ngOnInit() :Promise<void> {
    this.accessControll();
  }



  async accessControll(): Promise<void> {
    this.my_institution_id = await this.dataService.getInstitutionId() || '';
    this.userAccessLevel = await this.dataService.getUserAccessLevel() || '';
    const institutionId: number = Number(this.route.snapshot.paramMap.get('institution_id'));

    if (!institutionId || 
        !(this.userAccessLevel == UserType.STATE_ADMIN || 
          this.userAccessLevel == UserType.DMER_ADMIN || 
          this.userAccessLevel == UserType.INSTITUTION_ADMIN)) {
      this.router.navigate(['/login']);
      return;
    } else {
      if (this.userAccessLevel == UserType.INSTITUTION_ADMIN && this.my_institution_id != institutionId) {
        this.router.navigate(['/login']);
        console.log('As an INSTITUTION_ADMIN, you do not have access to this page');
        return;
      }
    }

    this.institution_id = institutionId;
    this.activate();
  }

  async activate(): Promise<void>{
    this.fetchMedicalCollegeDetails();
  }


  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  fetchMedicalCollegeDetails(){
    this.institutionsService.fetchMedicalCollegeDetails(this.dataService.getInstitutionId()).subscribe(
      (response: any) => {
        console.log(response);
        if(response.success){
          this.institution = response.data;
        }
        else {
         
        }

      }
    )
  }

  editMode(){

  }
  submitChanges(form: NgForm) {
    if (form.invalid) {
      // Iterate through all form controls and mark them as touched
      Object.keys(form.controls).forEach(key => {
        const control = form.controls[key];
        control.markAsTouched();  // Mark control as touched to show validation errors
      });
      return; // Don't submit if the form is invalid
    }
  
    // Call the API to save changes
    console.log('Submitted changes:', this.institution);
    this.isEditMode = false;
  }
  

}
