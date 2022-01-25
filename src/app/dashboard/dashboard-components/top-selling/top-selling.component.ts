import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Boleta } from '../../../models/boleta';
import { PledgeService } from '../../../services/pledge/pledge.service';
import { TSMap } from "typescript-map"
import moment from 'moment';
import { BatchService } from '../../../services/batch/batch.service';

@Component({
  selector: 'app-top-selling',
  templateUrl: './top-selling.component.html'
})
export class TopSellingComponent implements OnInit, OnDestroy {

  private currentDateObservable: Observable<string>

  currentDate = moment().utc().format()
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  boletas: Boleta[] = []
  pics = [
    "assets/images/users/user2.jpg",
    "assets/images/users/user4.jpg",
  ]

  clientPics = new TSMap<number, number>();

  constructor(
    private pledgeService: PledgeService,
    private batchService: BatchService,
  ) {
    this.currentDateObservable = this.batchService.selectedDateSubject.asObservable()
    this.currentDateObservable.subscribe(val => {
      this.currentDate = val
    })
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      columnDefs: [
        { orderable: true, targets: 0 }
      ],
      order: [
        [1, "desc"]
      ],
    };

    let savedClientPics = localStorage.getItem("clientPics")
    if (savedClientPics) {
      let parsedData = JSON.parse(savedClientPics)
      for (var value in parsedData) {
        this.clientPics.set(+value, parsedData[value])
      }
    }

    this.pledgeService.pledgeList().subscribe(data => {
      for (const i of data) {
        if (!this.clientPics.has(i.id_persona)) {
          i.pic = this.pics[Math.floor(Math.random() * 2)]
          this.clientPics.set(i.id_persona, i.pic)
        }
        else {
          i.pic = this.clientPics.get(i.id_persona)
        }
      }

      localStorage.setItem('clientPics', JSON.stringify(this.clientPics.toJSON()))

      this.boletas = data
      this.dtTrigger.next()
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

}
