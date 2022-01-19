import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ClientSearchResult } from '../models/client';
import { ClientService } from '../services/client/client.service';

@Component({
  selector: 'app-busqueda-cliente',
  templateUrl: './busqueda-cliente.component.html',
  styleUrls: ['./busqueda-cliente.component.scss']
})
export class BusquedaClienteComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  loading = false
  showAlert = false
  showTable = true
  id_detalle_prenda: string = ""
  query = ""

  clientSearchResult: ClientSearchResult[] = []

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      searching: false,
    };

    const id = sessionStorage.getItem("id_detalle_prenda")
    if (id) {
      this.id_detalle_prenda = id
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  searchClient(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      dtInstance.destroy();
    })

    this.clientSearchResult = []
    this.loading = true
    this.showAlert = false
    this.clientService.searchClient(this.query).subscribe(data => {
      this.clientSearchResult = data
      this.dtTrigger.next()
      this.loading = false
      this.showTable = false
      if (this.clientSearchResult.length < 1) {
        this.showAlert = true
      }
    })
  }

  saveSelectedClient(numero_ide: string) {
    localStorage.setItem("selected_client_ide", numero_ide)
  }
}
