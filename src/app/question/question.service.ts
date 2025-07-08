import { Question, QuestionOption } from './question';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor() { }

  questionList = signal<Question[]>([]);

  private questions = new Map<string, Question>();

  public generateQuestion(text: string, options: QuestionOption[], multiple: boolean = false): void {
    let id = Math.round(Math.random() * 100000).toString();
    this.questions.set(
      id,
       {
        id: id,
        options: options,
        text: text,
        multiple: multiple
       } as Question);
  }

  public deleteQuestion(id: string): boolean {
    return this.questions.delete(id);
  }

  public getAllQuestions(): Question[] {
    return Array.of(...this.questions.values());
  }

  private getQuestions(): void {

  }

}
