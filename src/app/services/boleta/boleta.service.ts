import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SERVER_BASE_URL } from '../../globals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {

  private baseURL = API_SERVER_BASE_URL

  constructor(private httpClient: HttpClient) { }

  public searchBoleta(query: string): Observable<any> {
    const endpoint = this.baseURL + "ticket_search?query=" + query
    return this.httpClient.get(endpoint)
  }

  public getBoleta(id: number): Observable<any> {
    const endpoint = this.baseURL + "ticket/" + id
    return this.httpClient.get(endpoint)
  }
}
