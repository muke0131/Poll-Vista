import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EmailService } from '../../../../core/services/email.service'; // adjust the path as needed

@Component({
  selector: 'app-survey-card',
  templateUrl: './survey-card.component.html',
  styleUrls: ['./survey-card.component.scss']
})
export class SurveyCardComponent {
  @Input() survey: any;
  @Input() showDelete: boolean = false;
  @Input() showEdit: boolean = false;
  @Input() showViewResponses: boolean = false;
  @Input() showPreview: boolean = false;
  @Input() showTakeSurvey: boolean = false;
  @Input() showGenerateLink: boolean = false;
  @Input() showAnalytics: boolean = false;

  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() viewResponses = new EventEmitter<string>();
  @Output() preview = new EventEmitter<string>();
  @Output() takeSurvey = new EventEmitter<string>();
  @Output() generateLink = new EventEmitter<string>();
  @Output() viewAnalytics = new EventEmitter<string>();

  constructor(private emailService: EmailService) { }

  deleteSurvey(surveyId: string): void {
    this.delete.emit(surveyId);
  }

  editSurvey(surveyId: string): void {
    this.edit.emit(surveyId);
  }

  goToSurveyResponse(surveyId: string): void {
    this.viewResponses.emit(surveyId);
  }

  previewSurvey(surveyId: string): void {
    this.preview.emit(surveyId);
  }

  goToTakeSurvey(surveyId: string): void {
    this.takeSurvey.emit(surveyId);

    const token = localStorage.getItem('auth_token');
    if (token) {
      const email = this.getEmailFromToken(token);
      if (email) {
        // Build the professional email payload
        const emailPayload = {
          to: email,
          subject: 'Thank you from the PollVista Team',
          text: `Dear Valued Participant,

Thank you for taking the time to complete our survey titled "${this.survey.title}". We truly appreciate your feedback.

Survey Description:
${this.survey.description}

Your insights are instrumental in helping us improve our services and provide an even better experience for our community.

Once again, thank you for your participation.

Best regards,
The PollVista Team`
        };

        this.emailService.sendEmail(emailPayload).subscribe(
          response => {
            console.log('Email sent successfully:', response);
          },
          error => {
            console.error('Error sending email:', error);
          }
        );
      } else {
        console.error('Could not extract email from token');
      }
    } else {
      console.error('No auth token found in local storage');
    }
  }

  generateSurveyLink(surveyId: string): void {
    this.generateLink.emit(surveyId);
  }

  goToAnalytics(surveyId: string): void {
    this.viewAnalytics.emit(surveyId);
  }


  private getEmailFromToken(token: string): string {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.sub;
    } catch (e) {
      console.error('Failed to decode token', e);
      return '';
    }
  }
}
