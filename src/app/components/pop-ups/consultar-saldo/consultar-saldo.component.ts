import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-consultar-saldo',
  templateUrl: './consultar-saldo.component.html',
  styleUrls: ['./consultar-saldo.component.css'],
  imports: [CommonModule, MatButtonModule]
})
export class ConsultarSaldoComponent {
  tipo: string;
  puntos?: number;
  saldo?: number;
  tarjeta?: string;
  cliente?: any;

  constructor(
    private dialogRef: MatDialogRef<ConsultarSaldoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tipo = data.tipo;
    this.puntos = data.puntos;
    this.saldo = data.saldo;
    this.tarjeta = data.tarjeta;
    this.cliente = data.cliente;
  }

  salir(): void {
    this.dialogRef.close();
  }

  imprimir(): void {
    window.print(); // o lo que quieras implementar
  }

}
