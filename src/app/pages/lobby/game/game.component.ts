import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatRadioButton} from '@angular/material/radio';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-game',
  imports: [
    MatIcon,
    MatFormField,
    MatLabel,
    MatCard,
    MatCardContent,
    MatRadioButton,
    MatSlideToggle,
    ReactiveFormsModule,
    MatButton,
    MatInput
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  gameForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.gameForm = this.fb.group({
      gameName: ['', Validators.required],
      description: [''],
      gameType: ['individual', Validators.required],
      timer: [30, [Validators.required, Validators.min(0)]],
      failWeight: [1, [Validators.required, Validators.min(0)]],
      showAnswerStatus: [true],
      showAnswers: [false],
      standaloneMode: [true]
    });
  }

  onSubmit() {
    if (this.gameForm.valid) {
      console.log('Form submitted:', this.gameForm.value);
      // Add your form submission logic here
    }
  }
}
