import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL = "http://10.60.63.100:5000/v1/"
  private userSubject: BehaviorSubject<any>
  public user: Observable<User> 

  constructor(
    private httpClient: HttpClient,
    private router: Router) { 
    let userVal = localStorage.getItem('user')!
    let userParsed = JSON.parse(userVal)
    this.userSubject = new BehaviorSubject<User>(userParsed)
    this.user = this.userSubject.asObservable()
  }

  public get userValue(): User {
    return this.userSubject.value
  }
  
  login(username: string, password: string) {
    let endpoint = this.baseURL + "auth";
    return this.httpClient.post<any>(endpoint, {username, password}).pipe(map(user => {
      console.log(user)
      localStorage.setItem('user', JSON.stringify(user))
      this.userSubject.next(user)
      return user 
    }))
  }

  logout() {
    localStorage.removeItem('user')
    this.userSubject.next(null)
    this.router.navigate(['/login'])
  }
}
