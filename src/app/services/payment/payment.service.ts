import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_SERVER_IP, API_SERVER_PORT } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly baseURL = "http://" + API_SERVER_IP + ":" + API_SERVER_PORT + "/v1/"

  constructor(
    private httpClient: HttpClient
  ) { }

  getRegistroPagos(idBoleta: number): Observable<any> {
    const endpoint = this.baseURL + "payment/" + idBoleta
    return this.httpClient.get(endpoint)
  }
}
