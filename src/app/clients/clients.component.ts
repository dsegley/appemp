import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Client } from '../models/client';
import { ClientService } from '../services/client/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  clients: Client[] = [];

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.clientService.getAllClients().subscribe(data => {
      this.clients = data
      this.dtTrigger.next()
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

}
