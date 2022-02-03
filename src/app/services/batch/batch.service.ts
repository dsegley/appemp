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
  private date = moment().format()

  constructor(private httpClient: HttpClient) { 
    moment().locale('es-mx')
    this.retriveSavedDate()
    this.selectedDateSubject = new BehaviorSubject<string>(
      this.date
    )
    this.selectedDateSubject.next(this.date)
  }


  private retriveSavedDate() {
    const savedDate = localStorage.getItem("date")
    if (savedDate) {
      this.date = savedDate
    }
  }

  /** Ejecutar consolidación */
  public runBatch(fechaCorte: string): Observable<any> {
    this.date = fechaCorte
    this.selectedDateSubject.next(this.date)
    localStorage.setItem('date', this.date)
    const endpoint = this.baseURL + "batch2"
    return this.httpClient.post(endpoint, {fecha_corte: fechaCorte})
  }
}
