import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
 
@Component({
  selector: 'app-delete-survey',
  templateUrl: './delete-survey.component.html',
  styleUrls: ['./delete-survey.component.scss']
})
export class DeleteSurveyComponent {
 
  constructor(
    public dialogRef: MatDialogRef<DeleteSurveyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { surveyId: string }
  ) {}
 
  onNoClick(): void {
    this.dialogRef.close(false);
  }
 
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
 