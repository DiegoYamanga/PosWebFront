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
import { reqTransactionsFidelidad } from '../../../DTOs/reqTransactionsFidelidad';
import { NavigationService } from '../../../logic/navigationService';
import { SessionLogic } from '../../../logic/sessionLogic';
import { NumeroTicketComponent } from '../pop-ups/numero-ticket/numero-ticket.component';

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
  nroTicket: string = '';

  constructor(
    private store: Store,
    private endpointLogic: EndpointAdapterLogic,
    private dialog: MatDialog,
    public serviceLogic: ServiceLogic,
    private navigation : NavigationService,
    private sessionLogic : SessionLogic
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


  async confirmarMonto() {
  if (!this.monto) return;
  
  console.log("Confirmo Monto --> quiero ticket?",this.sessionLogic.getAllowNumberTicket())
  if (this.sessionLogic.getAllowNumberTicket()) {
    const dialogRef = this.dialog.open(NumeroTicketComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe((nroTicket: number | null) => {
      if (nroTicket) {
        this.nroTicket = nroTicket.toString(); // O nroTicket si deseas mantenerlo como number
        this.etapa = 'detalle';
      }
    });
    }else{
      this.etapa = 'detalle';
    }
  }




  confirmarTipoOperacion() {
      const origen = this.serviceLogic.getOrigenOperacionTarjeta();
      console.log("Origen de operación:", origen);

      if (origen === 'COMPRA') {
        this.confirmarOperacionTarjeta();
      } else if (origen === 'GIFTCARD') {
        this.confirmarOperacion();
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

  async confirmarOperacionTarjeta() {
    console.log("Confirmar con Tarjeta")

    if (!this.cliente || !this.monto) return;
    this.loginSpinner = true;

    const payload: reqTransactionsFidelidad = {
      serial_number: 'MOBILE',
      identification: this.cliente.datosCliente.identification,
      amount: parseFloat(this.monto),
      local_datetime: new Date().toISOString(),
      branch_id: this.branchID
    };

    try {
      const result = await this.endpointLogic.crearTransaccionFidelidad(this.storeID, payload);
      console.log("Obtuve la transaccion por fidelidad?")
      console.log("✔️ Transacción Fidelidad registrada:", result);

      this.loginSpinner = false;
      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: true,
          titulo: 'Operación Exitosa',
          descripcion: 'La transacción fue realizada correctamente.',
          origen: 'FIDELIDAD'
        }
      });
      this.navigation.goToInicio();
    } catch (e) {
      console.error("❌ Error al registrar transacción Fidelidad:", e);
      this.loginSpinner = false;
      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: false,
          titulo: 'Error',
          descripcion: 'No se pudo registrar la transacción. Intente más tarde.',
          origen: 'FIDELIDAD'
        }
      });
    }
  }



}
