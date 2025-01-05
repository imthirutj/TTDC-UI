import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-server-pagination',
  templateUrl: './server-pagination.component.html',
  styleUrls: ['./server-pagination.component.css']
})
export class ServerPaginationComponent {

  @Input() pageAttributes: {
    currentPage: number;
    totalPages: number;
  } = {
    currentPage: 1,
    totalPages: 1
  };

 
  @Output() triggerParentFunction = new EventEmitter<void>();


  onPrevPage() {
    if (this.pageAttributes.currentPage > 1) {
      this.pageAttributes.currentPage--;
      this.triggerParentFunction.emit();
    }
  }

  onNextPage() {
    if (this.pageAttributes.currentPage < this.pageAttributes.totalPages) {
      this.pageAttributes.currentPage++;
      this.triggerParentFunction.emit();
    }
  }
}
