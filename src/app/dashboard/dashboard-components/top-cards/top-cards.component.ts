import { Component, OnInit } from '@angular/core';
import {topcard,topcards} from './top-cards-data';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbDatepicker, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-console.component',
  templateUrl: './console.component.html'
})
export class ConsoleModalComponent {
  constructor(public activeModal: NgbActiveModal) {}

  onDateSelect(event: any) {
    
  }
}

@Component({
  selector: 'app-top-cards',
  templateUrl: './top-cards.component.html'
})
export class TopCardsComponent implements OnInit {

  topcards:topcard[];

  constructor(private modalService: NgbModal) { 

    this.topcards=topcards;
  }

  ngOnInit(): void {
  }


  consola() {
    this.modalService.open(ConsoleModalComponent, {ariaLabelledBy: 'modal-basic-title'})
  }
}
