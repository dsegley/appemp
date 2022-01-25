import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_SERVER_BASE_URL } from '../../globals';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  public selectedDateSubject: BehaviorSubject<string>
  private baseURL = API_SERVER_BASE_URL

  constructor(private httpClient: HttpClient) { 
    this.selectedDateSubject = new BehaviorSubject<string>(
      moment().utc().format()
    )
  }

  /** Ejecutar consolidación */
  public runBatch(fechaCorte: string): Observable<any> {
    this.selectedDateSubject.next(fechaCorte)
    const endpoint = this.baseURL + "batch2"
    return this.httpClient.post(endpoint, {fecha_corte: fechaCorte})
  }
}
