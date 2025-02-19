import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from '../../../core/services/response.service'; 

@Component({
  selector: 'app-response-detail',
  templateUrl: './response-detail.component.html',
  styleUrls: ['./response-detail.component.scss'],})
export class ResponseDetailComponent implements OnInit {
  surveyResponse: any; 
  isSingleResponse: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private responseService: ResponseService 
  ) {}

  onBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    const responseId = this.route.snapshot.paramMap.get('responseId'); 
    if (responseId) {
      this.isSingleResponse = true;
      this.responseService.getSurveyResponse(responseId).subscribe(
        (response) => {
          this.surveyResponse = response;
        },
        (error) => {
          console.error('Error fetching specific response:', error);
          this.router.navigate(['/dashboard']); 
        }
      );
    } else {
      console.error('No response ID found.');
      this.router.navigate(['/dashboard']); 
    }
  }
}