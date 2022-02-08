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
import moment, { Moment } from 'moment';


class MortageRow {
  constructor(
    public montoAPagar: number = 0.0,
    public capital: number = 0.0,
    public deuda: number = 0.0,
    public pago: number = 0.0,
    public diferencia: number = 0.0,
  ) { }
}


@Component({
  selector: 'app-datos-empeno',
  templateUrl: './datos-empeno.component.html',
  styleUrls: ['./datos-empeno.component.scss']
})
export class DatosEmpenoComponent implements OnInit {
  
  private totalPaymentsByMonth: number[] = [] // Montos de pagos agrupados por mes
  private interesTotal = 0.0 // monto de prestamo + (monto de prestamo * tasa interes)
  private interes = 0.0 // interes total / periodo
  private adeudoTotal = 0.0 // monto de prestamo mas interes
  private adeudoRestante = 0.0 // adeudo total - pago total
  private currentDeadLine = 0
  
  deadlines: Moment[] = []
  monthlyPayment = 0 // monto a pagar este mes
  currentDate: string = moment().utc(true).format()
  mortageTable: MortageRow[] = []
  forPayment = false // vista de pago o confirmación?
  datosBoleta: Boleta = new Boleta()
  loading = true
  registroPagos: Payment[] = []
  pagoTotal = 0.0
  currentTab: number = 0
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

    this.retriveSavedDate()

    this.loading = true
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('boleta')
      if (id) {
        // mostrar datos de la boleta
        this.inicio = false
        this.boletaService.getBoleta(+id).subscribe((data) => {
          this.datosBoleta = data
          this.forPayment = true
          
          /** Globales */
         this.calcGlobals()

          // obtener registro de pagos
          this.paymentService.getRegistroPagos(this.datosBoleta.id_boleta).subscribe({
            next: (data) => {
              this.registroPagos = data
              // sumar registros de pago
              this.pagoTotal = 0
              this.registroPagos.forEach(item => {
                this.pagoTotal += item.monto;
              })

              this.adeudoRestante = this.adeudoTotal - this.pagoTotal
              if (this.adeudoRestante < 0) {
                this.adeudoRestante = 0
              }

              this.calcMortageTable()
              this.loading = false
            },
            error: (error) => {
              if (error === "NOT FOUND") {
                // El backend retorna 404
                this.adeudoRestante = this.adeudoTotal
                this.calcMortageTable()
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
          const date = moment(this.currentDate)
          const dateStr = date.year() + "-" + (+date.month() + 1) + "-" + date.date()
          this.pledgeService.getDatosEmpeno(1, [+cotizacion], dateStr).subscribe(data => {
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
                this.calcGlobals()
                this.calcMortageTable()
              })
            }
          })
        }
      }
    })
  }

  changeCurrentTab(id: number) {
    if (this.currentTab === id) {
      return
    }

    this.currentTab = id
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
          this.showModal("Datos registrados con exito. Boleta #" + data.id_boleta)
          this.router.navigateByUrl("/dashboard")
        },
        error: (err) => {
          this.showModal("Ha ocurrido un error.")
          console.error(err);
        }
      })
    }
  }

  pagar(monto: number) {

    // Boleta desempeñada
    if (this.datosBoleta.id_cat_stats_bol !== 1) {
      this.showModal("La boleta ya no está activa")
      return
    }

    monto = Math.min(monto, this.adeudoRestante)

    if (monto > 0) {

      let payment = new Payment()
      payment.monto = monto
      payment.fecha_pago = this.currentDate
      payment.id_boleta = this.datosBoleta.id_boleta

      const currentRow = this.mortageTable[this.currentDeadLine]

      if (monto > currentRow.montoAPagar) {
        payment.id_cat_stats_pago = 3 // capital + refrendo??
      }

      else if (monto + currentRow.pago > currentRow.montoAPagar) {
        payment.id_cat_stats_pago = 2 // capital
      }

      else {
        payment.id_cat_stats_pago = 1 // ??
      }

      this.paymentService.addPayment(payment).subscribe({
        next: (data) => {
          this.showModal("Pago registrado con exito")
          this.ngOnInit()
          this.inicio = false

        },
        error: () => {
          this.showModal("Ah ocurrido un error")
        }
      })
    }

    else {
      this.showModal("Ingrese un monto valido")
    }
  }

  private showModal(message: string) {
    const activeModal = this.modalService.open(ModalMessageComponent, {
      ariaLabelledBy: 'modal-basic-title'
    })
    activeModal.componentInstance.message = message
  }

  /** Sumar los registros de pago por fecha */
  private addPaymentsByDate() {
    const periodo = this.datosBoleta.periodo
    const montlyPay = +(this.adeudoTotal / periodo).toFixed(2)
    var payments: number[] = []

    // ...
    for (let x = 0; x < periodo; x++) {
      payments.push(0)
    }
    
    // TODO: Esto solo funciona si el backend retorna las fechas de pago en orden desc
    for (let i = 0; i < periodo; i++) {
      // maybe utc no sea necesario
      const deadline = this.deadlines[i].utc()
      let pastdate = i == 0 ? moment(this.deadlines[0].format()).add(-1, "month").add(-1, "day") : this.deadlines[i - 1]

      for (let f = 0; f < this.registroPagos.length; f++) {
        const date = moment(new Date(this.registroPagos[f].fecha_pago), "DD MM YYYY", true).utc()

        if (date.isSameOrBefore(deadline) && date.isAfter(pastdate)) {
          if (payments[i] >= montlyPay) {
            payments[i + 1] += this.registroPagos[f].monto
            continue;
          }

          payments[i] += this.registroPagos[f].monto
        }
      }
    }

    this.totalPaymentsByMonth = payments
  }

  /** Variables que se utilizan para generar la tabla de amortización */
  private calcGlobals() {
    this.interesTotal = +this.datosBoleta.mont_prest_total * +this.datosBoleta.tasa_interes
    this.interes = this.interesTotal / this.datosBoleta.periodo
    this.adeudoTotal = +this.datosBoleta.mont_prest_total + this.interesTotal
  }

  private retriveSavedDate() {
    const savedDate = localStorage.getItem("date")
    if (savedDate) {
      this.currentDate = savedDate
    }
  }

  private calcMortageTable() {

    /** Calcular dependencias */
    this.calcDeadLines()
    this.calcCurrentDeadLine()
    this.addPaymentsByDate()

    this.mortageTable = []
    const periodo = this.datosBoleta.periodo

    let pago = 0.0
    let montoAPagar = this.adeudoTotal / periodo

    if (this.totalPaymentsByMonth.length > 0) {
      pago = this.totalPaymentsByMonth[0]
    }

    this.mortageTable.push({
      deuda: this.datosBoleta.mont_prest_total + this.interes - pago,
      capital: this.datosBoleta.mont_prest_total / periodo,
      montoAPagar: montoAPagar,
      pago: pago,
      diferencia: montoAPagar - pago,
    })

    for (let i = 1; i < periodo; ++i) {
      const prevRow = this.mortageTable[i - 1]

      let pago = 0.0
      if (this.totalPaymentsByMonth.length > i) {
        pago = this.totalPaymentsByMonth[i]
      }

      let capital = prevRow.deuda / (periodo - i)
      let montoAPagar = capital + this.interes

      this.mortageTable.push({
        deuda: prevRow.deuda + this.interes - pago,
        capital: capital,
        montoAPagar: montoAPagar,
        pago: pago,
        diferencia: montoAPagar - pago,
      })
    }

    this.calcMonthlyPayment()
  }

  changeDate(id: number) {
    if (id < 0) {
      this.currentDate = moment().utc().format()
      this.calcCurrentDeadLine()
      this.calcMonthlyPayment()
      return
    }

    this.currentDeadLine = id
    this.currentDate = this.deadlines[id].utc().format()
    this.calcMonthlyPayment()
  }

  /** Si la fecha cambia, recalcular la prox fecha de vencimiento */
  private calcCurrentDeadLine() {
    this.deadlines.every(e => {
      if (moment(this.currentDate).month() == e.month()) {
        this.currentDeadLine = this.deadlines.indexOf(e)
        return false
      }

      return true
    })

    console.log(this.currentDeadLine)
  }

  /** Con la tabla de amortización se calcula el pago del mes actual */
  private calcMonthlyPayment() {
    const currentRow = this.mortageTable[this.currentDeadLine]
    this.monthlyPayment = Math.max(0, currentRow.diferencia)
  }

  /** Dado el periodo de la boleta, podemos calcular las fechas limite */
  private calcDeadLines() {
    this.deadlines = []
     for (let i = 0; i < 10; i++) {
      this.deadlines.push(
        moment(
          new Date(this.datosBoleta.fecha_alta), "DD MM YYYY", true
        ).utc().add(i + 1, "months").utc()
      )
    }
  }
}
