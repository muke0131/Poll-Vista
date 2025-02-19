// src/app/core/services/email.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8082/api/email/send';

  constructor(private http: HttpClient) { }

  sendEmail(emailPayload: { to: string; subject: string; text: string }): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<string>(this.apiUrl, emailPayload, { headers }).pipe(
      catchError(error => {
        console.error('Error sending email:', error);
        return throwError(() => new Error('Failed to send email.'));
      })
    );
  }
}
