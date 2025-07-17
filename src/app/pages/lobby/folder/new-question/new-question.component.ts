import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatCard} from '@angular/material/card';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-new-question',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatRadioGroup,
    MatRadioButton,
    MatCard,
    MatInput,
    MatButton,
  ],
  templateUrl: './new-question.component.html',
  styleUrl: './new-question.component.scss'
})
export class NewQuestionComponent {
  questionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: [''],
      option4: [''],
      correctAnswer: ['1', Validators.required]
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      console.log('Form submitted:', this.questionForm.value);
      // Add form submission logic here
    }
  }
}
