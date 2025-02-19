import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../../core/services/survey.service';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  isEditMode = false;
  surveyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService
  ) {
    this.surveyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      deadline: ['', Validators.required],
      isPublic: [true, Validators.required],
      questions: this.fb.array([], Validators.required)
    });
  }

  ngOnInit() {
    this.surveyId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.surveyId) {
      this.isEditMode = true;
      const storedSurveys = localStorage.getItem('surveys');
      if (storedSurveys) {
        const surveys = JSON.parse(storedSurveys);
        const survey = surveys.find((s: any) => s.id === this.surveyId);
        if (survey) {
          this.surveyForm.patchValue({
            title: survey.title,
            description: survey.description,
            deadline: survey.deadline,
            isPublic: survey.isPublic !== undefined ? survey.isPublic : true
          });
          survey.questions.forEach((q: any) => {
            const questionGroup = this.createQuestion();
            questionGroup.patchValue(q);
            this.questions.push(questionGroup);
          });
        }
      }
    }
  }

  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      questionText: ['', [Validators.required, Validators.minLength(5)]],
      questionType: ['text'],
      mcqOptions: this.fb.array([])
    });
  }

  createOption(): FormControl {
    return this.fb.control('');
  }

  addQuestion(): void {
    this.questions.push(this.createQuestion());
    this.surveyForm.updateValueAndValidity();
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
    this.surveyForm.updateValueAndValidity();
  }

  addMcqOption(questionIndex: number): void {
    const question = this.questions.at(questionIndex);
    const mcqOptions = question.get('mcqOptions') as FormArray;
    mcqOptions.push(this.createOption());
  }

  removeMcqOption(questionIndex: number, optionIndex: number): void {
    const question = this.questions.at(questionIndex);
    const mcqOptions = question.get('mcqOptions') as FormArray;
    mcqOptions.removeAt(optionIndex);
  }

  onQuestionTypeChange(index: number): void {
    const question = this.questions.at(index);
    const questionType = question.get('questionType')?.value;

    if (questionType === 'MCQ') {
      const mcqOptions = question.get('mcqOptions') as FormArray;
      if (mcqOptions.length === 0) {
        this.addMcqOption(index);
      }
    }
  }

  getMcqOptions(question: any): FormArray<FormControl> {
    return question.get('mcqOptions') as FormArray<FormControl>;
  }

  onSubmit(): void {
    if (this.surveyForm.invalid) {
      console.log('Form is invalid', this.surveyForm.errors);
      this.surveyForm.markAllAsTouched();
      return;
    }

    console.log('Form is valid', this.surveyForm.value);

    const surveyData = this.surveyForm.value;
    const formattedSurveyData = {
      ...surveyData,
      questions: surveyData.questions.map((q: any) => ({
        questionType: q.questionType,
        questionText: q.questionText,
        options: q.mcqOptions || []
      }))
    };

    if (this.isEditMode && this.surveyId) {
      this.surveyService.updateSurvey(this.surveyId, formattedSurveyData).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    } else {
      this.surveyService.createSurvey(formattedSurveyData).subscribe((response) => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
