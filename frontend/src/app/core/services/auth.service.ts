import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; 

  constructor(private http: HttpClient) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token); 
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, { withCredentials: true });
  }

  logout(): Observable<any> {
    localStorage.removeItem('auth_token');
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  getProtectedData(): Observable<any> {
    return this.http.get('/api/api/protected', { withCredentials: true });
  }
}