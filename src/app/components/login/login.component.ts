import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { StateComercioAction } from '../../redux/action';
import { AppModule } from '../../app.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';



export interface Comercio {
  id: string | undefined;
  nombre: string | undefined;
  ubicacion: string | undefined;
  imagenUrl: string | undefined;
}


@Component({
  standalone : true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public hide = true;
  public loginError: boolean = false;

  public loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private store: Store, private router: Router) {}

  login() {
    const datosComercio: Comercio = {
      id: '123',
      nombre: 'Supermercado Juan',
      ubicacion: 'Calle Falsa 123',
      imagenUrl: 'https://placehold.co/200x100'
    };

    this.store.dispatch(StateComercioAction.setComercio({ comercio: datosComercio }));
    this.router.navigate(['/sorteo']);
  }
}


