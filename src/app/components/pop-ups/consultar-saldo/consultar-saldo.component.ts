import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AppSelectors } from '../../../redux/selectors';
import { Store } from '@ngrx/store';

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
  storeID!: string;
  branchID!: string;

  constructor(
    private dialogRef: MatDialogRef<ConsultarSaldoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {
    this.tipo = data.tipo;
    this.puntos = data.puntos;
    this.saldo = data.saldo;
    this.tarjeta = data.tarjeta;
    this.cliente = data.cliente;

  }

  ngOnInit(): void {
    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
          this.storeID = loginData.store.id.toString();
          this.branchID = loginData.branch.id.toString();
        console.log("ID de sucursal:", loginData.branch.id);
        console.log("ID de Store:", loginData.store.id);

    }
    });
  }

  salir(): void {
    this.dialogRef.close();
  }

  imprimir(): void {
    window.print(); // o lo que quieras implementar
  }

}
