import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})



export class CpService {
   private baseURL = "http://10.60.63.100:5000/v1/"
  constructor( private httpClient: HttpClient) {  }

public searchCp(query:string) : Observable<any>{
  const endpoint = this.baseURL + "cp/?query=" + query
  return this.httpClient.get(endpoint)
}
}
