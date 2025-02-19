import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SurveyService } from '../../../core/services/survey.service';

@Component({
  selector: 'app-preview-survey',
  templateUrl: './preview-survey.component.html',
  styleUrls: ['./preview-survey.component.scss']
})
export class PreviewSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  surveyData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
    return question.get('dropdownOptions') as FormArray;
  }

  getMcqOptions(question: any): FormArray {
    return question.get('mcqOptions') as FormArray;
  }
}