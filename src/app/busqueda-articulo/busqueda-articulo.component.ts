import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Prenda } from '../services/prenda/prenda';
import { PrendaService } from '../services/prenda/prenda.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda-articulo.component.html',
  styleUrls: ['./busqueda-articulo.component.scss']
})
export class BusquedaArticuloComponent implements OnInit {

  public busqueda: Prenda[] = []
  public query: string = ''
  public showAlert = false
  
  loading = false

  constructor(
    private prendaService: PrendaService,
    private route: ActivatedRoute)
     { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      let param = params.get("query")

      if (param) {
        this.query = param
        this.search()
      }
    })
  }

  search(): void {
    this.loading = true
    this.showAlert = false
    this.busqueda = []
    this.prendaService.searchItem(this.query).subscribe(data => {
      this.busqueda = data;
      this.loading = false
      if (this.busqueda.length < 1) {
        this.showAlert = true
      }
    })
  }

}
