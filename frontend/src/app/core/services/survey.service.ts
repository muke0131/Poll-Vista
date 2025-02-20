import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private apiUrl = 'http://13.49.18.131:8080/surveys'; 
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

  createSurvey(surveyData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, surveyData, {
      headers: this.getHeaders(), 
      withCredentials: true,
    });
  }

  updateSurvey(surveyId: string, surveyData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${surveyId}`, surveyData, {
      headers: this.getHeaders(), 
      withCredentials: true, 
    });
  }

  getSurveyById(surveyId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${surveyId}`, {
      headers: this.getHeaders(),
    });
  }
  deleteSurvey(surveyId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${surveyId}`);
  }
 
}