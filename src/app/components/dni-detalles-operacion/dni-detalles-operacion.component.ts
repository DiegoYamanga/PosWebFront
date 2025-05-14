import { Component } from '@angular/core';
import { AppSelectors } from '../../redux/selectors';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
@Component({
  selector: 'app-dni-detalles-operacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './dni-detalles-operacion.component.html',
  styleUrl: './dni-detalles-operacion.component.css'
})
export class DniDetallesOperacionComponent {
  cliente: ResClienteDTO | undefined;
  etapa: 'monto' | 'detalle' | 'firma' = 'monto';
  monto: string = '';
  nombreFirmado: string = '';

  constructor(private store: Store,
              private endpointAdapterlogic : EndpointAdapterLogic
  ) {}

  ngOnInit(): void {
    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      this.cliente = cliente;
      console.log("Cliente desde Redux:", cliente);
    });
  }

  agregarNumero(valor: string) {
    this.monto += valor;
  }

  borrarUltimo() {
    this.monto = this.monto.slice(0, -1);
  }

  confirmarMonto() {
    if (this.monto) {
      this.etapa = 'detalle';
    }
  }

  continuarAFirma() {
    this.etapa = 'firma';
  }

  confirmarOperacion() {
    console.log("Nombre firmado:", this.nombreFirmado);
  }

  calcularPuntos(monto: string): number {
  const valor = parseFloat(monto.replace(',', '.'));
  return valor * 0.1;
}



}
