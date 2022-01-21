import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_SERVER_BASE_URL } from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  private baseURL = API_SERVER_BASE_URL

  constructor(private httpClient: HttpClient) { }

  /** Ejecutar consolidación */
  public runBatch(fechaCorte: string): Observable<any> {
    const endpoint = this.baseURL + "batch2"
    return this.httpClient.post(endpoint, {fecha_corte: fechaCorte})
  }
}
