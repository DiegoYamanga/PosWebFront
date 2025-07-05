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
import { MatButtonModule } from '@angular/material/button';
import { StateResLoginDTOAction } from '../../redux/action';
import { response } from 'express';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  error: string | null = null;
  public hide = true;
  public loginError: boolean = false;
  public loginSpinner: boolean = false;

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
    this.loginSpinner = true;

    const user = this.loginForm.value.user?.trim();
    const password = this.loginForm.value.password?.trim();

    if (!user || !password) {
      this.error = "Usuario y contraseña son requeridos.";
      this.loginSpinner = false;
      return;
    }

    const credentials = { user, password };

    this.endPointAdapterLogic.loginFinal(credentials).subscribe({
      next: (res: any) => {
        if (res?.token) {
          const fullUserData = {
            ...res,
            username: user
          };
          this.sessionLogic.setLoginData(res.token, fullUserData);
          this.navigation.goToInicio();
        } else {
          this.error = 'Credenciales incorrectas.';
        }
        this.loginSpinner = false;
      },
      error: () => {
        this.error = 'Error al intentar ingresar.';
        // this.router.navigate(['/error-login']);
        this.loginSpinner = false;
      }
    });
  }
}


