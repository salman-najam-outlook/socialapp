import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseURL = 'http://localhost:3000/api/socialapp';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpClient) {}

  registerUser(body): Observable<any> {
    return this.http.post(`${baseURL}/register`, body);
  }

  loginUser(body): Observable<any> {
    return this.http.post(`${baseURL}/login`, body);
  }
}
