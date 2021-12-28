import { Component, OnInit } from '@angular/core';
import { ClientSearchResult } from '../models/client';
import { ClientService } from '../services/client/client.service';

@Component({
  selector: 'app-busqueda-cliente',
  templateUrl: './busqueda-cliente.component.html',
  styleUrls: ['./busqueda-cliente.component.scss']
})
export class BusquedaClienteComponent implements OnInit {

  loading = false
  showAlert = false
  id_detalle_prenda: string = ""
  query = ""

  clientSearchResult: ClientSearchResult[] = []

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    const id = sessionStorage.getItem("id_detalle_prenda")
    if (id) {
      this.id_detalle_prenda = id
    }
  }

  searchClient(): void {
    this.clientSearchResult = []
    this.loading = true
    this.showAlert = false
    this.clientService.searchClient(this.query).subscribe(data => {
      this.clientSearchResult = data
      if (this.clientSearchResult.length < 1) {
        this.showAlert = true
      }

      this.loading = false
    })
  }
}
