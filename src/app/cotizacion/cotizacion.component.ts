import { Component, OnInit } from '@angular/core';
import { Prenda } from '../services/prenda/prenda';
import { CatEstPrenda } from '../services/prenda/cat-est-prenda';
import { PrendaService } from '../services/prenda/prenda.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})
export class CotizacionComponent implements OnInit {

  catEstadoPrenda: CatEstPrenda[] = []
  prenda!: Prenda;

  selectedEstadoPrenda = -1
  prestamoMinimo = 0
  prestamoMaximo = 0
  prestamoAprobado = 0

  loading = true
  isButtonDisabled = true

  id_detalle_prenda = ""

  countOptions = {
    duration: 0.5,
    prefix: "$"
  }

  constructor(
    private prendaService: PrendaService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.prendaService.getCatEst().subscribe(data => {
      this.catEstadoPrenda = data;
      this.route.paramMap.subscribe(params => {
        const id = params.get("prenda")
        if (id) {
          this.prendaService.getItemDetail(Number(id)).subscribe(data => {
            this.prenda = data[0]
            let montos: number[] = []
            this.catEstadoPrenda.forEach(e => {
              montos.push(e.porc_aforo * Number(this.prenda?.monto_aforo))
            })
        
            this.prestamoMaximo = Number(Math.max(...montos).toFixed(2))
            this.prestamoMinimo = (Number(Math.min(...montos).toFixed(2)))

            this.loading = false
            this.id_detalle_prenda = id
          })
        }
      })
    })
  }

  calcular() {
    if (this.selectedEstadoPrenda == -1) {
      this.isButtonDisabled = true
      return
    }

    this.isButtonDisabled = false
    this.prestamoAprobado = this.prenda?.monto_aforo * this.catEstadoPrenda[this.selectedEstadoPrenda]?.porc_aforo
    this.prestamoAprobado = Number(this.prestamoAprobado.toFixed(2))
  }

  saveData() {
    sessionStorage.setItem("id_detalle_prenda", this.id_detalle_prenda )
    sessionStorage.setItem("cotizacion_value", String(this.prestamoAprobado) )
  }
}
