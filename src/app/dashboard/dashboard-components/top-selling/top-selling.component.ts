import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Boleta } from '../../../models/boleta';
import { PledgeService } from '../../../services/pledge/pledge.service';

@Component({
  selector: 'app-top-selling',
  templateUrl: './top-selling.component.html'
})
export class TopSellingComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  boletas: Boleta[] = []
  pics = [
    "assets/images/users/user2.jpg",
    "assets/images/users/user4.jpg",
  ]

  constructor(private pledgeService: PledgeService) {

  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.pledgeService.pledgeList().subscribe(data => {
      for (const i of data) {
        i.pic = this.pics[Math.floor(Math.random() * 2)]
      }

      this.boletas = data
      this.dtTrigger.next()
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

}
