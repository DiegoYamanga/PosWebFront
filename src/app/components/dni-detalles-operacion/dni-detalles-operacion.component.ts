import { Component } from '@angular/core';
import { AppSelectors } from '../../redux/selectors';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { HeaderComponent } from "../header/header.component";
import { NavigationService } from '../../../logic/navigationService';
import { MatDialog } from '@angular/material/dialog';
import { TipoCanjeDialogoComponent } from '../tipo-canje-dialogo/tipo-canje-dialogo.component';
import { StateTipoCanjeAction } from '../../redux/action';
import { reqTransactionsFidelidad } from '../../../DTOs/reqTransactionsFidelidad';
import { NotificacionComponent } from '../notificacion/notificacion.component';

@Component({
  selector: 'app-dni-detalles-operacion',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './dni-detalles-operacion.component.html',
  styleUrl: './dni-detalles-operacion.component.css'
})
export class DniDetallesOperacionComponent {
  cliente: ResClienteDTO | undefined;
  etapa: 'monto' | 'detalle' | 'firma' = 'monto';
  monto: string = '';
  nombreFirmado: string = '';
  tipoCanje$: any;
  origenOperacion: 'CANJE' | 'COMPRA' | null = null;
  storeID: string = '';
  branchID: string = '';

  constructor(private store: Store,
              private endpointAdapterlogic : EndpointAdapterLogic,
              private navigation: NavigationService,
              private dialog : MatDialog
  ) {
    this.tipoCanje$ = this.store.select(AppSelectors.selectTipoCanje);
  }

  ngOnInit(): void {
    this.store.select(AppSelectors.selectOrigenOperacion).subscribe(origen => {
      this.origenOperacion = origen;
    });

    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      this.cliente = cliente;
    });

    this.tipoCanje$.subscribe((tipo: any) => {
      console.log('Tipo de canje seleccionado:', tipo);
    });

    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
        this.storeID = loginData.store.id.toString();
        this.branchID = loginData.branch.id.toString();
      }
    });
  }

  confirmarMonto() {
    if (!this.monto) return;

    if (this.origenOperacion === 'CANJE') {
      const dialogRef = this.dialog.open(TipoCanjeDialogoComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((opcion: 'IMPORTE' | 'PUNTOS') => {
        if (opcion) {
          this.store.dispatch(StateTipoCanjeAction.setTipoCanje({ tipoCanje: opcion }));
          this.etapa = 'detalle'; // solo pasar a etapa 2 después del popup
        }
      });
    } else {
      this.etapa = 'detalle'; // flujo directo si no viene de CANJE
    }
  }

  // continuarAFirma() {
  //   this.confirmarOperacion()
  // }

  async confirmarOperacion() {
    if (!this.cliente || !this.monto) return;

    const payload: reqTransactionsFidelidad = {
      serial_number: 'MOBILE',
      identification: this.cliente.datosCliente.identification,
      amount: parseFloat(this.monto),
      local_datetime: new Date().toISOString(),
      branch_id: this.branchID
    };

    try {
      const result = await this.endpointAdapterlogic.crearTransaccionFidelidad(this.storeID, payload);
      console.log("✔️ Transacción Fidelidad registrada:", result);

      this.dialog.open(NotificacionComponent, {
        width: '800px',
        data: {
          success: true,
          titulo: 'Operación Exitosa',
          descripcion: 'La transacción fue realizada correctamente.',
          origen: 'FIDELIDAD'
        }
      });
    } catch (e) {
      console.error("❌ Error al registrar transacción Fidelidad:", e);

      this.dialog.open(NotificacionComponent, {
        width: '800px',
        data: {
          success: false,
          titulo: 'Error',
          descripcion: 'No se pudo registrar la transacción. Intente más tarde.',
          origen: 'FIDELIDAD'
        }
      });
    }
  }

  calcularPuntos(monto: string): number {
    const valor = parseFloat(monto.replace(',', '.'));
    return valor * 0.1;
  }

  onConfirmar() {
    if (this.origenOperacion === 'CANJE') {
      const dialogRef = this.dialog.open(TipoCanjeDialogoComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((opcion: 'IMPORTE' | 'PUNTOS') => {
        if (opcion) {
          this.store.dispatch(StateTipoCanjeAction.setTipoCanje({ tipoCanje: opcion }));
          // continuar flujo de canje...
        }
      });
    } else {
      // seguir flujo normal para compras u otros
      console.log("Flujo alternativo sin popup");
    }
  }

}
