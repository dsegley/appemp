import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrendaService {

  private baseURL = "http://10.60.63.100:5000/v1/" 

  constructor(private httpClient: HttpClient) { }

  /** Retorna la busqueda en el catalogo de prendas */
  public searchItem(query:string): Observable<any> {
    let endpoint = this.baseURL + "item/?query=" + query
    return this.httpClient.get(endpoint)
  }

  /** Retornar el catalogo de estados de prenda */
  public getCatEst(): Observable<any> {
    let endpoint = this.baseURL + "cat_est_prenda"
    return this.httpClient.get(endpoint)
  }
}
