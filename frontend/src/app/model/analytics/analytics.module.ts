export interface QuestionAnalytics {
  questionText: string;
  questionType: 'MCQ' | 'Text' | 'Rating';
  responseDistribution: { [key: string]: number };
  chartData?: { name: string; value: number }[];
}

export interface Analytics {
  totalSurveys: number;
  totalResponses: number;
  mostAnsweredQuestion: string;
  leastAnsweredQuestion: string;
  averageResponseTime: number;
  averageResponsesPerSurvey: number;
  questions: QuestionAnalytics[];
}
