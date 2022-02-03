import { Component, OnInit } from '@angular/core';
import { BatchService } from '../services/batch/batch.service';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consola',
  templateUrl: './consola.component.html',
  styleUrls: ['./consola.component.scss']
})
export class ConsolaComponent implements OnInit {

  date = moment()

  constructor(
    private batchService: BatchService,
    private router: Router,
  ) 
  { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }; 
  }

  ngOnInit(): void {
  }


  submit() {
    const fechaCorte = moment(
      this.date.day + "/" + this.date.month + "/" + this.date.year, "DD MM YYYY", false
     ).utc().format()
    this.batchService.runBatch(fechaCorte).subscribe(() => {
      this.router.navigateByUrl('/route')
    })
  }
}
