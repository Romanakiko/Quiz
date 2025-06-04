import {Component, inject} from '@angular/core';
import {SupabaseService} from '../../supabase/supabase.service';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {GoogleSigninButtonDirective} from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    GoogleSigninButtonDirective
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent{
  private readonly supabase = inject(SupabaseService);
  private formBuilder = inject(FormBuilder);

  loading = false
  signInOtpForm = this.formBuilder.group({
    email: '',
  })
  signInForm = this.formBuilder.group({
    email: '',
    password: '',
  })
  constructor() {}
  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const email = this.signInOtpForm.value.email as string
      const { error } = await this.supabase.signInWithOtp(email)
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.signInOtpForm.reset()
      this.loading = false
    }
  }

  async signUp(): Promise<void> {
    const { error } = await this.supabase.signUpWithEmail(this.signInForm.value.email ?? '', this.signInForm.value.password ?? '')
    if (error)
    console.error('Check your email and password!', error)
  }
  async signIn(): Promise<void> {
    const { error } = await this.supabase.signInWithEmail(this.signInForm.value.email ?? '', this.signInForm.value.password ?? '')
    if (error)
      console.error('Check your email and password!', error)
  }
}
