import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_SERVER_BASE_URL } from '../../globals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CpService {
  private baseURL = API_SERVER_BASE_URL
  constructor(private httpClient: HttpClient) { }

  public searchCp(query: string): Observable<any> {
    const endpoint = this.baseURL + "cp/?query=" + query
    return this.httpClient.get(endpoint)
  }
}
