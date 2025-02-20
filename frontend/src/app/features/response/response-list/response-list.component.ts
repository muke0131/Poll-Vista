import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-response-list',
  templateUrl: './response-list.component.html',
  styleUrls: ['./response-list.component.scss']
})
export class ResponseListComponent implements OnInit {
  surveyId: any | undefined;
  responses: any[] = [];
  survey: any = {};
  users: any[] = []; 
  expandedResponseId: string | null = null; 

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('surveyId') || undefined;
    this.fetchResponses();
    this.fetchSurveyDetails();
    this.fetchUserDetails();
  }

  fetchResponses(): void {
    this.http.get<any[]>(`http://13.49.18.131:8080/responses/surveys/${this.surveyId}`)
      .subscribe(
        (data) => {
          this.responses = data;
        },
        (error) => {
          console.error('Error fetching responses:', error);
        }
      );
  }

  fetchSurveyDetails(): void {
    this.http.get<any>(`http://13.49.18.131:8080/surveys/${this.surveyId}`)
      .subscribe(
        (data) => {
          this.survey = data;
        },
        (error) => {
          console.error('Error fetching survey details:', error);
        }
      );
  }

  fetchUserDetails(): void {
    this.http.get<any[]>('http://13.49.18.131:8080/users')
      .subscribe(
        (data) => {
          this.users = data;
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
  }

  getUserName(userId: number): string {
    const user = this.users.find((u: { id: number; name: string; }) => u.id === userId);
    return user ? user.name : 'Unknown User';
  }

  getUserEmail(userId: number): string {
    const user = this.users.find((u: { id: number; email: string; }) => u.id === userId);
    return user ? user.email : 'Unknown Email';
  }

  toggleResponse(responseId: string): void {
    this.expandedResponseId = this.expandedResponseId === responseId ? null : responseId;
  }

  isResponseExpanded(responseId: string): boolean {
    return this.expandedResponseId === responseId;
  }

  downloadExcel(): void {
    const headerColumns = ['User Name', 'User Email', 'Started At', 'Submitted At'];
    if (this.responses.length > 0 && this.responses[0].responses) {
      this.responses[0].responses.forEach((item: any) => {
        headerColumns.push(item.question.questionText);
      });
    }
    const exportData: any[] = this.responses.map(response => {
      const userName = this.getUserName(response.userId);
      const userEmail = this.getUserEmail(response.userId);
      const startedAt = new Date(response.startedAt).toLocaleString();
      const submittedAt = new Date(response.submittedAt).toLocaleString();
      const row: any = {
        'User Name': userName,
        'User Email': userEmail,
        'Started At': startedAt,
        'Submitted At': submittedAt
      };

      response.responses.forEach((item: any) => {
        row[item.question.questionText] = item.answer;
      });

      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: headerColumns });
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Responses': worksheet },
      SheetNames: ['Responses']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const fileName = (this.survey.title ? this.survey.title : 'responses') + '.xlsx';
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  }
}
