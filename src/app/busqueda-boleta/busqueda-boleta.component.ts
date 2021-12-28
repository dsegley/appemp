import { Component, OnInit } from '@angular/core';
import { SearchBoletaResult } from '../models/boleta';
import { BoletaService } from '../services/boleta/boleta.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-MX'

registerLocaleData(localeEs, 'es')

@Component({
  selector: 'app-busqueda-boleta',
  templateUrl: './busqueda-boleta.component.html',
  styleUrls: ['./busqueda-boleta.component.scss']
})
export class BusquedaBoletaComponent implements OnInit {

  query = ""
  loading = false
  showAlert = false

  searchBoletaResult: SearchBoletaResult[] = []

  constructor(private boletaService: BoletaService) { }

  ngOnInit(): void {
  }

  /** TODO - todos los componentes que requieran de buscar deberian de heredar 
   * de una clase */
  search(): void {
    this.searchBoletaResult = []
    this.loading = true
    this.showAlert = false

    this.boletaService.searchBoleta(this.query).subscribe(data => {
      this.searchBoletaResult = data
      if (this.searchBoletaResult.length < 1) {
        this.showAlert = true
      }

      this.loading = false
    })
  }

}
