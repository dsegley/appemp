import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatosEmp } from '../../models/datos_emp';
import { Observable } from 'rxjs';
import { API_SERVER_IP, API_SERVER_PORT } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class PledgeService {

  private readonly baseURL = "http://" + API_SERVER_IP + ":" + API_SERVER_PORT + "/v1/"

  constructor(private httpClient: HttpClient) { }

  getDatosEmpeno(id_producto_emp: number, montos_aprobados: number[]) : Observable<any> {
    const montosToJson = JSON.stringify({montos_aprobados})
    const montosURI = encodeURIComponent(montosToJson)
    const endpoint = this.baseURL + 'pledge?prod=' + id_producto_emp + '&montos=' + montosURI
    return this.httpClient.get(endpoint)
  }

  addEmpeno(datosEmp: DatosEmp): Observable<any> {
    const endpoint = this.baseURL + "pledge";
    return this.httpClient.post(endpoint, datosEmp)
  }
}
