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

  getDatosEmpeno(id_producto_emp: number, montos_aprobados: number[], initial_date: string) : Observable<any> {
    const montosToJson = JSON.stringify({montos_aprobados})
    const montosURI = encodeURIComponent(montosToJson)
    const endpoint = this.baseURL + 'pledge?prod=' + id_producto_emp + '&montos=' + montosURI + '&initialdate=' + initial_date
    return this.httpClient.get(endpoint)
  }

  addEmpeno(new_pledge: Boleta): Observable<any> {
    const endpoint = this.baseURL + "pledge";
    return this.httpClient.post(endpoint, new_pledge)
  }

  /** Lista todos las boletas */
  public pledgeList(limit : number = 0) : Observable<any> {
    let endpoint = API_SERVER_BASE_URL + "pledge_list"
    if (limit > 0) {
      endpoint += "?limit=" + limit
    }
    return this.httpClient.get(endpoint)
  }
}
