import { Component, OnInit } from '@angular/core';
import { Prenda } from '../../services/prenda/prenda';
import { PrendaService } from '../../services/prenda/prenda.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss']
})
export class BusquedaComponent implements OnInit {

  public busqueda: Prenda[] = []
  public query: string = ''
  public showAlert = false

  constructor(private prendaService: PrendaService) { }

  ngOnInit(): void {
  }

  search(): void {
    this.prendaService.searchItem(this.query).subscribe(data => {
      this.busqueda = data;

      if (this.busqueda.length < 2) {
        this.showAlert = true
      }

      else {
        this.showAlert = false
      }
    })
  }

}
