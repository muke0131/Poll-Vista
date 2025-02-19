import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private apiUrl = 'http://localhost:8082/responses';

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

  submitSurveyResponse(surveyResponseData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, surveyResponseData, {
      headers: this.getHeaders(),
      withCredentials: true, 
    });
  }

  getAllResponsesForSurvey(surveyId: string): Observable<any> {
    const url = `${this.apiUrl}/survey/${surveyId}`;
    return this.http.get<any>(url, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }

  getSurveyResponse(responseId: string): Observable<any> {
    console.log(responseId);
    
    const url = `${this.apiUrl}/${responseId}`; 
    return this.http.get<any>(url, {
      headers: this.getHeaders(),
      withCredentials: true,
    });
  }
}
