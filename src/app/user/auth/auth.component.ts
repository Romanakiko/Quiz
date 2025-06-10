import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {GoogleSigninButtonDirective} from "@abacritt/angularx-social-login";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatHint, MatInput, MatLabel} from '@angular/material/input';
import {AuthService} from './auth.service';
import {MatDivider} from '@angular/material/divider';
import {Subscription} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    GoogleSigninButtonDirective,
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatInput,
    MatDialogTitle,
    MatDivider,
    MatError,
    MatHint,
    MatLabel
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<AuthComponent>);
  private authService = inject(AuthService);
  authError = this.authService.errorMessage;
  inputError: string | null = null;
  sessionSubscription: Subscription | null = null;
  formSubmitted = false;

  onNoClick(): void {
    this.dialogRef.close();
  }

  signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })
  get email() { return this.signInForm.get('email'); }
  get password() { return this.signInForm.get('password'); }

  constructor() {}

  ngOnInit(): void {
    this.sessionSubscription = this.authService.$session.subscribe(session => {
      if (session) {
        this.dialogRef.close();
      }
    })
    }

  signUp(): void {
    if(!this.isFormInalid()) {
      this.authService.signUp(this.signInForm.value.email ?? '', this.signInForm.value.password ?? '')
    }
    this.formSubmitted = true;
    // this.dialogRef.close();
  }

  signIn(): void {
    if(!this.isFormInalid()) {
      this.authService.signIn(this.signInForm.value.email ?? '', this.signInForm.value.password ?? '')
    }
    this.formSubmitted = true;
    // this.dialogRef.close();
  }

  isFormInalid(): boolean {
    return !!(this.email?.hasError('email')
      || this.email?.hasError('required')
      || this.password?.hasError('minlength')
      || this.password?.hasError('required'))
  }

  ngOnDestroy(): void {
    this.sessionSubscription?.unsubscribe();
  }
}
