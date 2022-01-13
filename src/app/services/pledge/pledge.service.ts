import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_SERVER_BASE_URL } from '../../globals';
import { Boleta } from '../../models/boleta';

@Injectable({
  providedIn: 'root'
})
export class PledgeService {

  private readonly baseURL = API_SERVER_BASE_URL

  constructor(private httpClient: HttpClient) { }

  getDatosEmpeno(id_producto_emp: number, montos_aprobados: number[]) : Observable<any> {
    const montosToJson = JSON.stringify({montos_aprobados})
    const montosURI = encodeURIComponent(montosToJson)
    const endpoint = this.baseURL + 'pledge?prod=' + id_producto_emp + '&montos=' + montosURI
    return this.httpClient.get(endpoint)
  }

  addEmpeno(new_pledge: Boleta): Observable<any> {
    const endpoint = this.baseURL + "pledge";
    return this.httpClient.post(endpoint, new_pledge)
  }
}
