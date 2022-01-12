import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoletaService } from '../services/boleta/boleta.service';
import { PledgeService } from '../services/pledge/pledge.service';
import { ModalMessageComponent } from '../shared/modal-message/modal-message.component';
import { Boleta } from '../models/boleta';
import { PaymentService } from '../services/payment/payment.service';
import { Payment } from '../models/pago';


enum PageTabs {
  Boleta = 0,
  Pagos = 1,
}


@Component({
  selector: 'app-datos-empeno',
  templateUrl: './datos-empeno.component.html',
  styleUrls: ['./datos-empeno.component.scss']
})
export class DatosEmpenoComponent implements OnInit {

  id_detalle_prenda = 0
  forPayment = false
  datosBoleta: Boleta = new Boleta()
  loading = true
  registroPagos: Payment[] = []
  pagoTotal = 0.0
  adeudo = 0.0
  currentTab = PageTabs.Boleta

  constructor(
    private pledgeService: PledgeService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private boletaService: BoletaService,
    private paymentService: PaymentService,
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('boleta')
      if (id) {
        // mostrar datos de la boleta
        this.boletaService.getBoleta(+id).subscribe((data) => {
          this.datosBoleta = data
          this.forPayment = true
          // obtener registro de pagos
          this.paymentService.getRegistroPagos(this.datosBoleta.id_boleta).subscribe(data => {
            this.registroPagos = data
            
            // sumar registros de pago
            this.registroPagos.forEach(item => {
              this.pagoTotal += item.monto;
            })
            this.adeudo = this.datosBoleta.mont_prest_total - this.pagoTotal
            this.loading = false
          })
        })
      }

      else {
        // mostrar datos de prod empeno(confirmazion)
        let cotizacion = localStorage.getItem('cotizacion_value')

        if (cotizacion) {
          this.pledgeService.getDatosEmpeno(1, [+cotizacion]).subscribe(data => {
            this.loading = false
            this.datosBoleta = data
            // ???
            this.datosBoleta.mont_prest_total = data['monto_prestamo_total']
          })
        }
      }
    })
  }

  switchTabs() {
    if (this.currentTab === PageTabs.Boleta) {
      this.currentTab = PageTabs.Pagos
    }

    else {
      this.currentTab = PageTabs.Boleta
    }
  }

  savePledge() {
    
  }

  pagar() {

  }
}
