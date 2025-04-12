import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { StateComercioAction } from '../../redux/action';
import { AppModule } from '../../app.component';



export interface Comercio {
  id: string | undefined;
  nombre: string | undefined;
  ubicacion: string | undefined;
  imagenUrl: string | undefined;
}


@Component({
  standalone : true,
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

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


