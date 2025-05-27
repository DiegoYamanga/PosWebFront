import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone : true, 
  selector: 'app-tarjeta-usuario',
  imports: [FormsModule,CommonModule],
  templateUrl: './tarjeta-usuario.component.html',
  styleUrl: './tarjeta-usuario.component.css'
})
export class TarjetaUsuarioComponent {

  numeroTarjeta: string = '';
  error: string | null = null;
  loading: boolean = false;

  constructor(private dialogRef: MatDialogRef<TarjetaUsuarioComponent>) {}

  confirmar() {
    this.dialogRef.close(this.numeroTarjeta);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
