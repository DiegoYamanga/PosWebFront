import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tipo-canje-dialogo',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './tipo-canje-dialogo.component.html',
  styleUrl: './tipo-canje-dialogo.component.css'
})
export class TipoCanjeDialogoComponent {

    constructor(private dialogRef: MatDialogRef<TipoCanjeDialogoComponent>) {}

  seleccionar(opcion: 'IMPORTE' | 'PUNTOS') {
    this.dialogRef.close(opcion);
  }

}
