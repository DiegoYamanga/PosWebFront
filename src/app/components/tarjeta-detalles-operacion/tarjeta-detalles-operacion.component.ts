import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { ReqGiftCardDatosDTO } from '../../../DTOs/reqGiftCardDatosDTO';
import { AppSelectors } from '../../redux/selectors';
import { Store } from '@ngrx/store';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { MatDialog } from '@angular/material/dialog';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { ServiceLogic } from '../../../logic/serviceLogic';

@Component({
  standalone: true,
  selector: 'app-tarjeta-detalles-operacion',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './tarjeta-detalles-operacion.component.html',
  styleUrl: './tarjeta-detalles-operacion.component.css'
})
export class TarjetaDetallesOperacionComponent {

  cliente!: ResClienteDTO;
  storeID: string = '';
  branchID: string = '';
  monto: string = '';
  etapa: 'monto' | 'detalle' = 'monto';
  loginSpinner: boolean = false;

  constructor(
    private store: Store,
    private endpointLogic: EndpointAdapterLogic,
    private dialog: MatDialog,
    private serviceLogic: ServiceLogic
  ) {}

  ngOnInit(): void {
    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      if (cliente) this.cliente = cliente;
    });

    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
        this.storeID = loginData.store.id.toString();
        this.branchID = loginData.branch.id.toString();
      }
    });
  }

  confirmarMonto() {
    if (this.monto) {
      this.etapa = 'detalle';
    }
  }

  async confirmarOperacion() {
    const tarjetaInfo = this.serviceLogic.getGiftCardInfo();

    if (!tarjetaInfo?.card_number || !this.monto) {
      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: false,
          titulo: 'Datos incompletos',
          descripcion: 'Faltan el número de tarjeta o el monto de la operación.',
          origen: 'GIFTCARD'
        }
      });
      return;
    }

    const body: ReqGiftCardDatosDTO = {
      serial_number: 'MOBILE',
      card_number: tarjetaInfo.card_number,
      amount: parseFloat(this.monto),
      local_datetime: new Date().toISOString(),
      branch_id: this.branchID
    };

    try {
      const result = await this.endpointLogic.descargarSaldoGiftCard(this.storeID, body);

      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: true,
          titulo: 'Compra exitosa',
          descripcion: 'La compra fue registrada correctamente.',
          origen: 'GIFTCARD'
        }
      });

    } catch (error: any) {
      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: false,
          titulo: 'Error en la operación',
          descripcion: 'No se pudo registrar la compra. Intente más tarde.',
          origen: 'GIFTCARD'
        }
      });
    }
  }



}
