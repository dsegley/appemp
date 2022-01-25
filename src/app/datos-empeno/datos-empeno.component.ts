import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoletaService } from '../services/boleta/boleta.service';
import { PledgeService } from '../services/pledge/pledge.service';
import { ModalMessageComponent } from '../shared/modal-message/modal-message.component';
import { Boleta } from '../models/boleta';
import { PaymentService } from '../services/payment/payment.service';
import { Payment } from '../models/pago';
import { PrendaService } from '../services/prenda/prenda.service';
import moment, { Moment } from 'moment';
import { TSMap } from 'typescript-map';


enum PageTabs {
  Boleta = 0,
  Pagos = 1,
}

class MortageStep {
  constructor(
    public montoAPagar: number = 0.0,
    public capital: number = 0.0,
    public deuda: number = 0.0,
    public pago: number = 0.0,
  ) {}
}


@Component({
  selector: 'app-datos-empeno',
  templateUrl: './datos-empeno.component.html',
  styleUrls: ['./datos-empeno.component.scss']
})
export class DatosEmpenoComponent implements OnInit, AfterViewInit {

  currentDate: string = moment().utc(true).format()
  forPayment = false
  datosBoleta: Boleta = new Boleta()
  deadlines = new TSMap<number, Moment>()
  currentDeadLine = 0
  loading = true
  registroPagos: Payment[] = []
  pagoMensual = 0.0 // monto a pagar este mes
  pagoTotal = 0.0
  adeudoTotal = 0.0 // monto de prestamo mas interes
  adeudoRestante = 0.0 // adeudo total - pago total
  currentTab = PageTabs.Boleta
  interesTotal = 0.0 // monto de prestamo + (monto de prestamo *  tasa interes)
  interes = 0.0 // interes total entre el periodo
  inicio = true

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

          // Calcular deadlines
          for (let i = 0; i < 10; i++) {
            this.deadlines.set(i, 
              moment(
                new Date(this.datosBoleta.fecha_alta), "DD MM YYYY", true
              ).utc().add(i + 1, "months").utc()
            )
          }

          /** Globales */
          this.interesTotal = +this.datosBoleta.mont_prest_total * +this.datosBoleta.tasa_interes
          this.interes = this.interesTotal / this.datosBoleta.periodo
          this.adeudoTotal = +this.datosBoleta.mont_prest_total + this.interesTotal
          this.calcCurrentDeadLine()

          // obtener registro de pagos
          this.paymentService.getRegistroPagos(this.datosBoleta.id_boleta).subscribe({
            next: (data) => {
              this.registroPagos = data
              // sumar registros de pago
              this.registroPagos.forEach(item => {
                this.pagoTotal += item.monto;
              })

              this.adeudoRestante = this.adeudoTotal - this.pagoTotal
              if (this.adeudoRestante < 0) {
                this.adeudoRestante = 0
              }

              this.pagoMensual = this.calcMortage(this.currentDeadLine).montoAPagar

              this.loading = false
            },
            error: (error) => {
              if (error === "NOT FOUND") {
                // El backend retorna 404
                this.pagoMensual = this.calcMortage(0).montoAPagar
                this.adeudoRestante = this.adeudoTotal
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

  ngAfterViewInit(): void {
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

    // boleta desempeñada
    if (this.datosBoleta.id_cat_stats_bol == 2) { 
      this.showModal("La boleta ya fue desempeñada")
      return
    }

    // comparar la fecha
    const today = moment().utc()
    const final =  moment(new Date(this.datosBoleta.fecha_fin), "DD MM YYYY", true).utc()
    if (today > final || this.datosBoleta.id_cat_stats_bol == 3) {
      this.showModal("La boleta ya esta vencida")
      this.inicio=false
      return
    }

    monto = Math.min(monto, this.adeudoRestante)

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
    
      this.paymentService.addPayment(payment).subscribe({
        next: (data) => {
          this.showModal("Pago registrado con exito")
          this.ngOnInit()
          this.inicio=false

        },
        error: () =>{
          this.showModal("Ah ocurrido un error")
        }
      })
    }

    if (this.pagoTotal + monto >= this.datosBoleta.mont_prest_total) {
      // cambiar el estado de la boleta a desempeñada
      this.boletaService.updateStatusBoleta(this.datosBoleta.id_boleta, 2).subscribe(response => {

      })
    }
  }

  private showModal(message: string) {
    const activeModal = this.modalService.open(ModalMessageComponent, { 
      ariaLabelledBy: 'modal-basic-title' 
    })
    activeModal.componentInstance.message = message
  }

  private calcMortage(numPago: number): MortageStep {
    const periodo = this.datosBoleta.periodo

    var deuda = 0.0
    var capital = 0.0
    var montoAPagar = 0.0
    var pago = 0.0

    if (numPago == 0) {
      if (this.registroPagos.length > 0) {
        pago = this.registroPagos[0].monto
      }
      
      capital = this.datosBoleta.mont_prest_total / periodo
      montoAPagar = this.adeudoTotal / periodo
      deuda = this.datosBoleta.mont_prest_total + this.interes - pago
      return {montoAPagar, capital, deuda, pago}
    }

    const anterior = this.calcMortage(numPago - 1)

    if (this.registroPagos.length > numPago) {
      pago = this.registroPagos[numPago].monto
    }
    
    deuda = anterior.deuda + this.interes - pago
    capital = anterior.deuda / (periodo - numPago)
    montoAPagar = capital + this.interes
    
    return {montoAPagar, capital, deuda, pago}
  }

  changeDate(id: number) {
    const initial_date = moment(
      new Date(this.datosBoleta.fecha_alta), "DD MM YYYY", true
    ).utc()

    if (id == -1) {
      this.currentDate = moment().utc(true).format()
      return
    }
    this.currentDate = moment(initial_date).add(id + 1, 'months').utc().format()
    this.calcCurrentDeadLine()
    this.pagoMensual = this.calcMortage(this.currentDeadLine).montoAPagar
  }

  calcCurrentDeadLine() {
    // ¿En que deadline nos encontramos?
    for (let i = 0; i <= this.deadlines.length - 1; ++i) {
      let is = moment(this.currentDate).isSameOrBefore(
        this.deadlines.get(i).utc()
      )

     if (is) {
       this.currentDeadLine = i
       break
     }
    }
  }
}
