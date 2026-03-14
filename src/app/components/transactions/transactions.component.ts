import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ServiceLogic } from '../../../logic/serviceLogic';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppSelectors } from '../../redux/selectors';

@Component({
  selector: 'app-transactions',
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  transacciones: any[] = [];
  transaccionesFiltradas: any[] = [];
  storeID!: number;
  branchID!: number;

  // Filtros
  fechaFiltro: string = '';
  horaDesde: string = '00:00';
  horaHasta: string = '23:59';

  limiteMostrar = 10;
  cargando = false;

  constructor(private serviceLogic: ServiceLogic,
              private store: Store,
  ) {}

  ngOnInit(): void {
    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
          if (loginData) {
            this.storeID = loginData.store.id;
            this.branchID = loginData.branch.id;
          }
        });
    this.cargarTransacciones();
  }

  cargarTransacciones() {
    this.cargando = true;
    this.serviceLogic.getTransactions(this.storeID).subscribe({
      next: (res) => {
        this.transacciones = res;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  aplicarFiltros() {
    this.transaccionesFiltradas = this.transacciones.filter(t => {
      const fechaTransaccion = new Date(t.date);

      // Filtro por Fecha
      if (this.fechaFiltro) {
        const f = new Date(this.fechaFiltro + 'T00:00:00');
        if (fechaTransaccion.toDateString() !== f.toDateString()) return false;
      }

      // Filtro por Rango de Hora
      const horaFormateada = `${fechaTransaccion.getHours().toString().padStart(2, '0')}:${fechaTransaccion.getMinutes().toString().padStart(2, '0')}`;
      return horaFormateada >= this.horaDesde && horaFormateada <= this.horaHasta;
    });
  }

  verMas() {
    this.limiteMostrar += 10;
  }

  get transaccionesVisibles() {
    return this.transaccionesFiltradas.slice(0, this.limiteMostrar);
  }
}
