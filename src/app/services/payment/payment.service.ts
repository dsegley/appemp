import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../../models/pago';
import { Observable } from 'rxjs';
import { API_SERVER_BASE_URL } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly baseURL = API_SERVER_BASE_URL

  constructor(
    private httpClient: HttpClient
  ) { }

  getRegistroPagos(idBoleta: number): Observable<any> {
    const endpoint = this.baseURL + "payment/" + idBoleta
    return this.httpClient.get(endpoint)
  }

  addPayment(payment: Payment): Observable<any> {
    const endpoint = this.baseURL + "payment"
    return this.httpClient.post(endpoint, payment)
  }
}
