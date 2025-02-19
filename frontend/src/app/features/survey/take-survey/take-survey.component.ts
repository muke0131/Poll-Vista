import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SurveyService } from '../../../core/services/survey.service';
import { ResponseService } from '../../../core/services/response.service';

@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.scss']
})
export class TakeSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  surveyData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private responseService: ResponseService,
    private surveyService: SurveyService
  ) {
    this.surveyForm = this.fb.group({
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const surveyId = this.activatedRoute.snapshot.paramMap.get('id');

    if (surveyId) {
      this.fetchSurveyData(Number(surveyId));
    }
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  fetchSurveyData(surveyId: any): void {
    this.surveyService.getSurveyById(surveyId).subscribe({
      next: (data: any) => {
        this.surveyData = data;
        this.loadSurveyQuestions();
      },
      error: (err: any) => {
        console.error('Error fetching survey data', err);
      },
    });
  }

  loadSurveyQuestions(): void {
    const questionsArray = this.surveyData.questions.map((q: any) => this.createQuestion(q));
    this.surveyForm.setControl('questions', this.fb.array(questionsArray));
  }

  createQuestion(question: any): FormGroup {
    const group: any = {
      questionText: [question.questionText],
      questionType: [question.questionType],
      id: [question.id]
    };

    if (question.questionType === 'text') {
      group.textAnswer = [''];
    } else if (question.questionType === 'rating') {
      group.rating = [null];
    } else if (question.questionType === 'dropdown') {
      group.selectedDropdownOption = [''];
      group.dropdownOptions = this.fb.array(question.options.map((option: any) => this.fb.control(option)));
    } else if (question.questionType === 'MCQ') {
      group.mcqOptions = this.fb.array(question.options.map((option: any) => this.fb.control(option)));
      group.selectedMcqOption = [''];
    }

    return this.fb.group(group);
  }

  getDropdownOptions(question: any): FormArray {
    console.log(question.get('dropdownOptions'));
    
    return question.get('dropdownOptions') as FormArray;
    
  }

  getMcqOptions(question: any): FormArray {
    return question.get('mcqOptions') as FormArray;
  }

  onSubmit(): void {
    if (this.surveyForm.valid) {
      const response = {
        surveyId: this.surveyData?.id,
        responses: this.surveyForm.value.questions.map((question: any) => {
          return {
            question: {
              id: question.id,
              questionType: question.questionType,
              questionText: question.questionText,
              options: question.dropdownOptions || question.mcqOptions || null,
            },
            answer: question.textAnswer || question.rating || question.selectedDropdownOption ||
              (question.selectedMcqOption || null),
          };
        }),
        startedAt: new Date().toISOString(),
      };

      this.responseService.submitSurveyResponse(response).subscribe({
        next: (data: any) => {
          console.log('Survey response submitted successfully:', data);
          this.router.navigate(['/response/response-detail', data.id]);
        },
        error: (err: any) => {
          console.error('Error submitting survey response:', err);
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }
}