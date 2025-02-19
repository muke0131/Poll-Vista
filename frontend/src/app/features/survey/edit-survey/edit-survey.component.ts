import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../../../core/services/survey.service'; // Import SurveyService

@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.scss']
})
export class EditSurveyComponent implements OnInit {
  surveyForm: FormGroup;
  surveyId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService 
  ) {
    this.surveyForm = this.fb.group({
      title: [''],
      description: [''],
      deadline: [''],
      isPublic: [true], 
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.surveyId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.surveyId) {
      this.loadSurveyData(this.surveyId);
    }
  }

  loadSurveyData(surveyId: string): void {
    this.surveyService.getSurveyById(surveyId).subscribe(
      (survey) => {
        this.surveyForm.patchValue({
          title: survey.title,
          description: survey.description,
          deadline: survey.deadline || '',
          isPublic: survey.isPublic !== undefined ? survey.isPublic : true
        });
  
        survey.questions.forEach((q: any) => {
          const questionGroup = this.createQuestion();
  
          q.questionType = q.questionType || 'text';
          questionGroup.patchValue({
            id: q.id,
            questionText: q.questionText,
            questionType: q.questionType
          });
  
          const mcqOptionsArray = questionGroup.get('mcqOptions') as FormArray;
          mcqOptionsArray.clear(); 
          if (q.questionType === 'MCQ' && q.options) {
            q.options.forEach((option: any) => {
              mcqOptionsArray.push(this.fb.group({ optionText: option }));
            });
          }
  
          this.questions.push(questionGroup);
        });
      },
      (error) => {
        console.error('Error fetching survey data:', error);
      }
    );
  }
  
  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }
  
  createQuestion(): FormGroup {
    return this.fb.group({
      id: [''], 
      questionText: [''],
      questionType: ['text'],
      textAnswer: [''],
      rating: [null],
      mcqOptions: this.fb.array([]) 
    });
  }
  
  createOption(): FormGroup {
    return this.fb.group({
      optionText: ['']
    });
  }
  
  onQuestionTypeChange(index: number): void {
    const question = this.questions.at(index);
    const questionType = question.get('questionType')?.value;
  
    if (questionType === 'MCQ') {
      this.addMcqOption(index);
    }
  }
  
  getMcqOptions(question: any): FormArray {
    return question.get('mcqOptions') as FormArray;
  }
  
  addQuestion(): void {
    this.questions.push(this.createQuestion());
  }
  
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
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
  
  onSubmit(): void {
    if (this.surveyForm.valid && this.surveyId) {
      const surveyData = this.surveyForm.value;
  
      const formattedSurveyData = {
        title: surveyData.title,
        description: surveyData.description,
        deadline: surveyData.deadline,
        isActive: true,
        isPublic: surveyData.isPublic, 
        questions: surveyData.questions.map((q: any) => ({
          id: q.id || this.generateId(), 
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.mcqOptions ? q.mcqOptions.map((opt: any) => opt.optionText) : null
        }))
      };
  
      this.surveyService.updateSurvey(this.surveyId, formattedSurveyData).subscribe(
        (response) => {
          console.log('Survey updated successfully', response);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error updating survey', error);
        }
      );
    }
  }
  
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
