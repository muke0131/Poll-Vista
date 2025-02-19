import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { Analytics, QuestionAnalytics } from '../../../model/analytics/analytics.module';

@Component({
  selector: 'app-survey-analytics',
  templateUrl: './survey-analytics.component.html',
  styleUrls: ['./survey-analytics.component.scss'],
})
export class SurveyAnalyticsComponent implements OnInit {
  analytics: Analytics | null = null;
  loading = true;
  selectedQuestionIndex: number = 0;
  mcqQuestions: QuestionAnalytics[] = []; 

  colorScheme = {
    domain: [
      '#1E3A8A', 
      '#A5B4FC', 
      '#6D28D9',
      '#C4B5FD', 
      '#4338CA', 
      '#D8B4FE',
      '#60A5FA',
      '#E0F2FE' 
    ]
  };

  barChartView: [number, number] = [800, 400];

  pieChartView: [number, number] = [800, 400];

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const surveyIdParam = params.get('surveyId');
      if (!surveyIdParam) {
        console.error('Survey ID is missing.');
        this.loading = false;
        return;
      }

      const surveyId = +surveyIdParam;
      if (isNaN(surveyId)) {
        console.error('Invalid Survey ID:', surveyIdParam);
        this.loading = false;
        return;
      }

      this.analyticsService.getSurveyAnalytics(surveyId).subscribe(
        (data: Analytics) => {
          if (data.questions && data.questions.length > 0) {
            data.questions.forEach((question: QuestionAnalytics) => {
              question.chartData = Object.entries(question.responseDistribution).map(
                ([key, value]) => ({ name: key, value: value })
              );
              if (question.questionType === 'MCQ') {
                this.mcqQuestions.push(question);
              }
            });
          }
          this.analytics = data;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching survey analytics:', error);
          this.loading = false;
        }
      );
    });
  }

  
  get currentQuestion(): QuestionAnalytics | undefined {
    return this.analytics?.questions
      ? this.analytics.questions[this.selectedQuestionIndex]
      : undefined;
  }

 
  onQuestionSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedQuestionIndex = +target.value;
  }
}
