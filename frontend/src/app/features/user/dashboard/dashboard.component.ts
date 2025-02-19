import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSurveyComponent } from './delete-survey/delete-survey.component'; 
import { SurveyService } from '../../../core/services/survey.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  username: string = 'User';
  mySurveys: any[] = []; 
  publicSurveys: any[] = [];
  isLoading: boolean = false;
  users: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private clipboard: Clipboard,
    private dialog: MatDialog,
    private surveyService: SurveyService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}


  showSnackbar(message: string, action: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar', type] 
    });
  }
  

  ngOnInit(): void {
    this.fetchMySurveys();
    this.fetchPublicSurveys();
    this.fetchUserDetails();
  }

  fetchMySurveys(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8082/surveys/my-surveys').subscribe(
      (data) => {
        this.mySurveys = data;
        this.isLoading = false;
        this.mapUserDetailsToSurveys(this.mySurveys); 
      },
      (error) => {
        console.error('Error fetching my surveys:', error);
        this.showSnackbar('Error fetching my surveys:'+ error,'OK','error');
        
        this.isLoading = false;
      }
    );
  }

  fetchPublicSurveys(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8082/surveys/others-surveys').subscribe(
      (data) => {
        this.publicSurveys = data;
        this.isLoading = false;
        this.mapUserDetailsToSurveys(this.publicSurveys); 
      },
      (error) => {
        this.showSnackbar('Error fetching public surveys:'+ error,'OK','error');
        this.isLoading = false;
      }
    );
  }

  fetchUserDetails(): void {
    this.http.get<any[]>('http://localhost:8082/users').subscribe(
      (data) => {
        this.users = data;
        this.mapUserDetailsToSurveys(this.mySurveys); 
        this.mapUserDetailsToSurveys(this.publicSurveys); 
      },
      (error) => {
        this.showSnackbar('Error fetching user details:'+error,'OK','success');

      }
    );
  }

  mapUserDetailsToSurveys(surveys: any[]): void {
    if (surveys.length > 0 && this.users.length > 0) {
      surveys.forEach((survey) => {
        const user = this.users.find((u) => u.id === survey.createdBy);
        if (user) {
          survey.createdByName = user.name;
          survey.createdByEmail = user.email;
        } else {
          survey.createdByName = 'Unknown User';
          survey.createdByEmail = 'Unknown Email';
        }
      });
    }
  }

  previewSurvey(surveyId: string): void {
    this.router.navigate(['/survey/preview-survey', surveyId]);
  }

  goToCreateSurvey(): void {
    this.router.navigate(['/survey/create-survey']);
  }

  editSurvey(surveyId: string): void {
    this.router.navigate(['/survey/edit-survey', surveyId]);
  }

  goToSurveyResponse(surveyId: string): void {
    this.router.navigate(['/response/response-list', surveyId]);
  }

  goToTakeSurvey(surveyId: string): void {
    this.router.navigate(['/survey/take-survey', surveyId]);
  }

  generateSurveyLink(surveyId: string): void {
    const baseUrl = window.location.origin;
    const surveyUrl = `${baseUrl}/survey/take-survey/${surveyId}?returnUrl=/survey/take-survey/${surveyId}`;
    this.clipboard.copy(surveyUrl);
    this.showSnackbar('Survey link copied to clipboard: ' + surveyUrl,'OK','success')
  }
  

  deleteSurvey(surveyId: string): void {
    const dialogRef = this.dialog.open(DeleteSurveyComponent, {
      width: '250px',
      data: { surveyId: surveyId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.surveyService.deleteSurvey(surveyId).subscribe(
          () => {
            this.fetchMySurveys();
            this.fetchPublicSurveys();
            this.cdr.detectChanges(); 
            this.showSnackbar('Survey deleted successfully','OK','success');
          },
          (error) => {
            console.error('Error deleting survey:', error);
            this.showSnackbar('Error deleting survey:'+ error,'OK','error');
          }
        );
      }
    });
  }

  goToAnalytics(surveyId: string): void {
    this.router.navigate(['/analytics', surveyId]);
  }

}