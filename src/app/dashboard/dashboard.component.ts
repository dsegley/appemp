import { Component, AfterViewInit, OnInit } from '@angular/core';
import { BatchService } from '../services/batch/batch.service';
import moment from 'moment';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
//declare var require: any;

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  private currentDateObservable: Observable<string>
  
  subtitle: string;
  date = moment()
  dateNav: {year: number, month: number} = {year: 2022, month: 2};
  datemodel: NgbDateStruct = {year: +this.date.year(), month: +this.date.month() + 5, day: +this.date.date()}

  constructor(
    private batchService: BatchService,
    private router: Router,
    private calendar: NgbCalendar,
  ) {
    this.subtitle = 'This is some text within a card block.';

    this.currentDateObservable = this.batchService.selectedDateSubject.asObservable()
    this.currentDateObservable.subscribe(val => {
      this.parseDate(val)
    })

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }; 
    
  }

  ngOnInit(): void {
  }

  private parseDate(val: string) {
    this.date = moment(val, "YYYY-MM-DD")
    this.datemodel = {year: +this.date.year(), month: +this.date.month() + 1, day: +this.date.date()}
  }
  
  ngAfterViewInit() {
    const user = localStorage.getItem("user")
    const savedDate = localStorage.getItem("date")
    localStorage.clear()
    if (user) {
      localStorage.setItem("user", user)
    }

    if (savedDate) {
      localStorage.setItem("date", savedDate)
    }
  }

  submit() {
    const fechaCorte = moment(
      new Date(this.datemodel.year, this.datemodel.month - 1, this.datemodel.day), "DD MM YYYY", false
    ).format()
    this.batchService.runBatch(fechaCorte).subscribe(response => {
      this.router.navigateByUrl('/route')
    })
  }
}
