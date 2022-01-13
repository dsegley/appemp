import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../../models/client';
import { Observable } from 'rxjs';
import { API_SERVER_BASE_URL } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseURL = API_SERVER_BASE_URL

  constructor(private httpClient: HttpClient) { }

  /** Retorna una lista de clientes que coincidan con el termino de busqueda */
  public searchClient(query: string) : Observable<any> {
    const endpoint = this.baseURL + 'client_search?query=' + query
    return this.httpClient.get(endpoint)
  }

  /** Inserta un cliente en la bd */
  public addClient(client: Client): Observable<any> {
    const endpoint = this.baseURL + 'client'
    return this.httpClient.post(endpoint, client)
  }

  /** Retorna el catalogo de indentificaciones */
  public getCatIde(): Observable<any> {
    const endpoint = this.baseURL + 'cat_ide'
    return this.httpClient.get(endpoint)
  }
}
