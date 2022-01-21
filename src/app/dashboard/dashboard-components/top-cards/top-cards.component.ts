import { Component, OnInit } from '@angular/core';
import {topcard,topcards} from './top-cards-data';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { ConsolaComponent } from '../../../consola/consola.component';

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
    const activeModal = this.modalService.open(ConsolaComponent, { 
      ariaLabelledBy: 'modal-basic-title' 
    })
  }
}
