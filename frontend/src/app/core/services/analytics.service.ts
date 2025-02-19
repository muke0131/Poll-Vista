import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Analytics } from '../../model/analytics/analytics.module';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:8082/analytics';

  constructor(private http: HttpClient) {}

  private getAuthToken(): string | null {
      return localStorage.getItem('auth_token'); 
    }
  
    private getHeaders(): HttpHeaders {
      const token = this.getAuthToken();
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
  
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
  
      return headers;
    }

  getSurveyAnalytics(surveyId: number): Observable<Analytics> {
    return this.http.get<Analytics>(`${this.apiUrl}/survey/${surveyId}`,{
      headers: this.getHeaders(),
      withCredentials: true, 
    });
  }

  getUserAnalytics(userId: number): Observable<Analytics> {
    return this.http.get<Analytics>(`${this.apiUrl}/user/${userId}`,{
      headers: this.getHeaders(),
      withCredentials: true, 
    });
  }
}