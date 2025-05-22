import { Component, inject, OnInit } from '@angular/core';
import { Question, QuestionOption } from './question';
import { QuestionService } from './question.service';

@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit {

  QuestionService = inject(QuestionService);

  options: QuestionOption[] = [
    {text: 'bird'},
    {text: 'plane'},
    {text: 'hueta'}
  ];
  question: Question = {
    id: '1',
    text: 'What is it looks like?',
    options: this.options,
    multiple: false
  }

  ngOnInit(): void {
    this.QuestionService.generateQuestion(this.question.text, this.question.options, false);
    this.QuestionService.generateQuestion(this.question.text, this.question.options, false);
    this.QuestionService.generateQuestion(this.question.text, this.question.options, false);
    let questions = this.QuestionService.getAllQuestions();
  }

  

}
