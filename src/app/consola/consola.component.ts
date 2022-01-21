import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BatchService } from '../services/batch/batch.service';
import moment from 'moment';

@Component({
  selector: 'app-consola',
  templateUrl: './consola.component.html',
  styleUrls: ['./consola.component.scss']
})
export class ConsolaComponent implements OnInit {

  date = moment()

  constructor(
    public activeModal: NgbActiveModal,
    private batchService: BatchService
  ) 
  { }

  ngOnInit(): void {
  }


  submit() {
    this.activeModal.close()
    const fechaCorte = moment(
      this.date.day + "/" + this.date.month + "/" + this.date.year, "DD MM YYYY", false
     ).utc().format()
    this.batchService.runBatch(fechaCorte).subscribe(() => {

    })
  }
}
