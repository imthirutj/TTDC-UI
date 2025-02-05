import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { DataService } from 'src/app/data.Service';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-top-section',
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.css']
})
export class TopSectionComponent {

  @Input() parentContext: any;

  constructor(private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private userService:UserService
  ) { 

  }

  ngOnInit() {
    this.getUser();
    console.log(this.parentContext.userAccessLevel); // Access parent variables
    console.log(this.parentContext.isEditable); // Access other variables
  }

  
  getUser(){
    if(this.dataService.getUserId() == null) return;
    this.userService.getUserDetails(this.dataService.getUserId()).subscribe(
      (response: any) => {
        this.parentContext.user = response.data;
        this.cdr.detectChanges();
      }
    )
  }


  ngOnChanges() {
    console.log('Parent Data has changed:', this.parentContext);
  }

}
