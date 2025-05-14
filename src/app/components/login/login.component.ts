import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { SessionLogic } from '../../../logic/sessionLogic';
import { NavigationService } from '../../../logic/navigationService';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private endPointAdapterLogic: EndpointAdapterLogic,
    private sessionLogic: SessionLogic,
    private navigation: NavigationService
  ) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
  
    const credentials = this.loginForm.value;
  
    this.endPointAdapterLogic.loginFinal(credentials).subscribe({
      next: (res: { token: string; }) => {
        if (res && res.token) {
          this.sessionLogic.setLoginData(res.token, res);
          this.navigation.irAFidelidad();
        } else {
          this.error = 'Credenciales incorrectas.';
        }
      },
      error: () => {
        this.router.navigate(['/error-login']);
      }
    });
  }
}
