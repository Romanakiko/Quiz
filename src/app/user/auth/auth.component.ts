import {Component, inject} from '@angular/core';
import {SupabaseService} from '../../supabase/supabase.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {GoogleSigninButtonDirective} from "@abacritt/angularx-social-login";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatHint, MatInput, MatLabel} from '@angular/material/input';
import {AuthService} from './auth.service';
import {MatDivider} from '@angular/material/divider';

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
export class AuthComponent{
  private readonly supabase = inject(SupabaseService);
  private formBuilder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<AuthComponent>);
  private authService = inject(AuthService);

  onNoClick(): void {
    this.dialogRef.close();
  }

  signInForm = this.formBuilder.group({
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required, Validators.minLength(6)]
  })

  constructor() {}

  async signUp(): Promise<void> {
    await this.authService.signUp(this.signInForm.value.email ?? '', this.signInForm.value.password ?? '')
    this.dialogRef.close();
  }
  async signIn(): Promise<void> {
    await this.authService.signIn(this.signInForm.value.email ?? '', this.signInForm.value.password ?? '')
    this.dialogRef.close();
  }
}
