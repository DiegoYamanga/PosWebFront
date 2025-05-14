import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,FormsModule,FormControl } from '@angular/forms';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { SessionLogic } from '../../../logic/sessionLogic';
import { NavigationService } from '../../../logic/navigationService';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AppModule } from '../../app.component';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // loginForm: FormGroup;
  // hide = true;
  error: string | null = null;
  public hide = true;
  public loginError: boolean = false;

  // public hide = true;
  // public loginError: boolean = false;

  public loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

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

    if(this.loginForm.value.user && this.loginForm.value.password){

      const credentials = {user:this.loginForm.value.user, password:this.loginForm.value.password};
  
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
}


