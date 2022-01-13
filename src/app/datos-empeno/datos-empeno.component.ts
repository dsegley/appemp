import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoletaService } from '../services/boleta/boleta.service';
import { PledgeService } from '../services/pledge/pledge.service';
import { ModalMessageComponent } from '../shared/modal-message/modal-message.component';
import { Boleta } from '../models/boleta';
import { PaymentService } from '../services/payment/payment.service';
import { Payment } from '../models/pago';
import { PrendaService } from '../services/prenda/prenda.service';
import moment from 'moment';


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
    private prendaService: PrendaService,
  ) {

  }

  ngOnInit(): void {
    this.loading = true
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('boleta')
      if (id) {
        // mostrar datos de la boleta
        this.boletaService.getBoleta(+id).subscribe((data) => {
          this.datosBoleta = data
          this.forPayment = true
          // obtener registro de pagos
          this.paymentService.getRegistroPagos(this.datosBoleta.id_boleta).subscribe({
            next: (data) => {
              this.registroPagos = data
            
              // sumar registros de pago
              this.registroPagos.forEach(item => {
                this.pagoTotal += item.monto;
              })
              this.adeudo = +this.datosBoleta.mont_prest_total - this.pagoTotal
              if (this.adeudo < 0) {
                this.adeudo = 0
              }
              this.loading = false
            },
            error: (error) => {
              if (error === "NOT FOUND") {
                // El backend retorna 404
                this.adeudo = this.datosBoleta.mont_prest_total
                this.loading = false 
              }
            }
          })
        })
      }

      else {
        // mostrar datos de prod empeno(confirmacion)
        let cotizacion = localStorage.getItem('cotizacion_value')

        if (cotizacion) {
          this.pledgeService.getDatosEmpeno(1, [+cotizacion]).subscribe(data => {
            this.datosBoleta = data
            this.datosBoleta.mont_prest_total = data['monto_prestamo_total']
            const id_detalle_prenda = localStorage.getItem("id_detalle_prenda")
            const estado_prenda = localStorage.getItem("estado_prenda")
            const cat_est_prenda = localStorage.getItem('cat_est_prenda')

            if (id_detalle_prenda && estado_prenda && cat_est_prenda) {
              this.prendaService.getItemDetail(+id_detalle_prenda).subscribe(item_data => {  
                item_data[0].estado_prenda = estado_prenda
                item_data[0].monto_prestamo = cotizacion
                item_data[0].id_cat_est_prenda = cat_est_prenda
                this.loading = false
                this.datosBoleta.prendas = item_data
              })
            }
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

    const client_ide = localStorage.getItem("selected_client_ide")
    if (client_ide) {
      this.datosBoleta.fecha_alta = moment(
       new Date(this.datosBoleta.fecha_alta), "DD MM YYYY", true
      ).utc().format()
      this.datosBoleta.fecha_fin = moment(
        new Date(this.datosBoleta.fecha_fin), "DD MM YYYY", true
      ).utc().format()
      this.datosBoleta.numero_ide = client_ide
      console.log(this.datosBoleta)

      this.pledgeService.addEmpeno(this.datosBoleta).subscribe({
        next: (data) => {
          this.showModal("Datos registrados con exito.")
          this.router.navigateByUrl("/datos-empeno/" + data.id_boleta)
        },
        error: (err) => {
          this.showModal("Ha ocurrido un error.")
          console.error(err);
        }
      })
    }
  }

  pagar(monto: number) {
    if (monto > 0) {
      let payment = new Payment()
      payment.monto = monto
      payment.fecha_pago = moment().utc().format()
      payment.id_boleta = this.datosBoleta.id_boleta

      const refrendo = this.datosBoleta.mont_prest_total * this.datosBoleta.tasa_interes

      if (monto > refrendo) {
        payment.id_cat_stats_pago = 2 // capital
      }

      else if (monto === refrendo) {
        payment.id_cat_stats_pago = 1 // refrendo
      }

      else {
        payment.id_cat_stats_pago = 3 // ??
      }

      // refrendo + capital? Cuando?
      // TODO: cambiar el estado de la boleta

      this.paymentService.addPayment(payment).subscribe({
        next: (data) => {
          this.showModal("Pago registrado con exito")
          this.ngOnInit()
        },
        error: () =>{
          this.showModal("Ah ocurrido un error")
        }
      })
    }
  }

  private showModal(message: string) {
    const activeModal = this.modalService.open(ModalMessageComponent, { 
      ariaLabelledBy: 'modal-basic-title' 
    })
    activeModal.componentInstance.message = message
  }
}
