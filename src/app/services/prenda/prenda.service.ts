import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_SERVER_IP, API_SERVER_PORT } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class PrendaService {

  private readonly baseURL = "http://" + API_SERVER_IP + ":" + API_SERVER_PORT + "/v1/"

  constructor(private httpClient: HttpClient) { }

  /** Retorna la busqueda en el catalogo de prendas */
  public searchItem(query:string): Observable<any> {
    let endpoint = this.baseURL + "item_search/?query=" + query
    return this.httpClient.get(endpoint)
  }

  /** Retornar el catalogo de estados de prenda */
  public getCatEst(): Observable<any> {
    let endpoint = this.baseURL + "cat_est_prenda"
    return this.httpClient.get(endpoint)
  }

  public getItemDetail(id:number): Observable<any> {
    let endpoint = this.baseURL + "item_detail/" + id
    return this.httpClient.get(endpoint) 
  }
}
