// gift-card.component.ts (refactorizado y optimizado)

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { NavigationService } from '../../../logic/navigationService';
import { StateGiftCardOperacionAction, StateMontoGiftCardAction } from '../../redux/action';
import { TarjetaUsuarioComponent } from '../pop-ups/tarjeta-usuario/tarjeta-usuario.component';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { ServiceLogic } from '../../../logic/serviceLogic';
import { ReqCancelarTransaccionByID } from '../../../DTOs/reqCancelarTransaccionByID';
import { ReqGiftCardDatosDTO } from '../../../DTOs/reqGiftCardDatosDTO';
import { ConsultarSaldoComponent } from '../pop-ups/consultar-saldo/consultar-saldo.component';
import { GiftcardDTO } from '../../../DTOs/giftCardsDTO';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { AppSelectors } from '../../redux/selectors';

@Component({
  standalone: true,
  selector: 'app-gift-card',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './gift-card.component.html',
  styleUrl: './gift-card.component.css'
})
export class GiftCardComponent {

  numeroTarjeta!: string;
  saldo: number | null = 0;
  etapa: 'seleccion' | 'monto' = 'seleccion';
  titulo: string = "";
  storeID!: string;
  branchID!: string;

  constructor(
    private navigation: NavigationService,
    private store: Store,
    private dialog: MatDialog,
    private endpointAdapterLogic: EndpointAdapterLogic,
    private serviceLogic: ServiceLogic
  ) {}

  ngOnInit(): void {
    console.log("Por lo menos estoy entrando a ngOnInit del gift card?")
    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      console.log("Loginda data--->",loginData)
      if (loginData) {
          this.storeID = loginData.store.id.toString();
          this.branchID = loginData.branch.id.toString();
        console.log("ID de sucursal:", loginData.branch.id);
        console.log("ID de Store:", loginData.store.id);

    }
    });
  }




  abrirPopupYGuardar(operacion: 'COMPRA' | 'CARGAR_SALDO' | 'ANULACION' | 'CONSULTAR_SALDO') {
    console.log("Abrir popUp y guardar")
    if (!this.storeID || !this.branchID) {
      console.log("No tengo datos del store o branch al consultar saldo")
      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: false,
          titulo: 'Datos incompletos',
          descripcion: 'No se pudo obtener el store o branch. Intente nuevamente.',
          origen: 'GIFTCARD'
        }
      });
      return;
    }

    this.store.dispatch(StateGiftCardOperacionAction.setGiftCardOperacion({ operacion }));

    const dialogRef = this.dialog.open(TarjetaUsuarioComponent, {
      width: '400px',
      disableClose: true
    });
    console.log("LLEGO ACA?")
    dialogRef.afterClosed().subscribe(async (resultado: { exitoso: boolean, nroTarjeta?: string } | null) => {

      if (!resultado?.exitoso || !resultado.nroTarjeta) return;

      this.numeroTarjeta = resultado.nroTarjeta;


      try {
        const respuesta: GiftcardDTO = await this.endpointAdapterLogic.consultarSaldoGiftCard(this.storeID, this.numeroTarjeta);
        console.log("la respuesta del consultar saldo",respuesta)
        this.serviceLogic.setGiftCardInfo(respuesta);
        this.titulo = this.obtenerTituloOperacion(operacion);


        if (operacion === 'CONSULTAR_SALDO') {
          this.dialog.open(ConsultarSaldoComponent, {
            width: '400px',
            data: {
              tipo: 'GIFTCARD',
              tarjeta: respuesta.card_number,
              saldo: respuesta.cash,
              puntos: respuesta.points
            }
          });
        } else {
          this.serviceLogic.setOrigenOperacionTarjeta('GIFTCARD');
          this.etapa = 'monto';
          this.titulo = this.obtenerTituloOperacion(operacion);
        }

      } catch (error: any) {
        console.error("Error al consultar saldo:", error);

        let mensajeError = 'Error desconocido. Intente nuevamente.';

        if (error?.status === 0) {
          mensajeError = 'Error de conexión con el servidor. Intente más tarde.';
        } else if (typeof error?.error === 'string') {
          mensajeError = error.error;
        }

        this.dialog.open(NotificacionComponent, {
          panelClass: 'full-screen-dialog',
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100vh',
          width: '100vw',
          data: {
            success: false,
            titulo: 'Error al verificar tarjeta',
            descripcion: mensajeError,
            origen: 'GIFTCARD'
          }
        });
      }
    });
  }




  obtenerTituloOperacion(operacion: string): string {
    console.log("SETEO TITULO: ", operacion)
    switch (operacion) {
      case 'COMPRA': return 'Monto de compra';
      case 'CARGAR_SALDO': return 'Cargar saldo';
      case 'ANULACION': return 'Anulación';
      default: return '';
    }
  }

  async consultarSaldoYMostrarPopup(numeroTarjeta: string) {
    try {
      const response: GiftcardDTO = await this.endpointAdapterLogic.consultarSaldoGiftCard(this.storeID, numeroTarjeta);
      this.serviceLogic.setGiftCardInfo(response);
      console.log("Estoy aca---> GIFTCARD DATA:",response)

      this.dialog.open(ConsultarSaldoComponent, {
        width: '400px',
        data: {
          tipo: 'GIFTCARD',
          tarjeta: response.card_number,
          saldo: response.cash,
          puntos: response.points
        }
      });
    } catch (e) {
      console.error("Error al consultar saldo:", e);
    }
  }

  irACompra() {
    this.abrirPopupYGuardar('COMPRA');
  }

  irACargarSaldo() {
    this.abrirPopupYGuardar('CARGAR_SALDO');
  }

  irAAnulacion() {
    this.abrirPopupYGuardar('ANULACION');
  }

  irAConsultarSaldo() {
    this.abrirPopupYGuardar('CONSULTAR_SALDO');
  }

  async confirmarOperacion() {
    const operacion = this.titulo;
    const tarjeta = this.numeroTarjeta;
    const monto = this.saldo;

    this.store.dispatch(StateMontoGiftCardAction.setMontoGiftCard({ monto }));

    try {
      let result: any;

      if (operacion === 'Cargar saldo') {
        result = await this.endpointAdapterLogic.cargarSaldoGiftCard(this.storeID, this.branchID, tarjeta, monto!);

        this.dialog.open(NotificacionComponent, {
          panelClass: 'full-screen-dialog',
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100vh',
          width: '100vw',
          data: {
            success: true,
            titulo: 'Carga Exitosa',
            descripcion: 'El saldo fue cargado correctamente.',
            origen: 'GIFTCARD'
          }
        });

      } else if (operacion === 'Anulación') {
        const cancelBody: ReqCancelarTransaccionByID = {
          serial_number: 'MOBILE',
          local_datetime: new Date().toISOString(),
          branch_id: this.branchID,
          card_number: tarjeta,
          identification: ''
        };

        result = await this.endpointAdapterLogic.anularTransaccion(this.storeID, tarjeta, cancelBody);

        this.dialog.open(NotificacionComponent, {
          panelClass: 'full-screen-dialog',
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100vh',
          width: '100vw',
          data: {
            success: true,
            titulo: 'Anulación Exitosa',
            descripcion: 'La transacción fue anulada correctamente.',
            origen: 'GIFTCARD'
          }
        });

      } else if (operacion === 'Monto de compra') {
        const body: ReqGiftCardDatosDTO = {
          serial_number: 'MOBILE',
          card_number: tarjeta,
          amount: monto!,
          local_datetime: new Date().toISOString(),
          branch_id: this.branchID
        };

        result = await this.endpointAdapterLogic.descargarSaldoGiftCard(this.storeID, body);
        this.serviceLogic.setUltimaOperacionGiftCard(result);

        this.dialog.open(NotificacionComponent, {
          panelClass: 'full-screen-dialog',
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100vh',
          width: '100vw',
          data: {
            success: true,
            titulo: 'Operación Exitosa',
            descripcion: 'La compra fue realizada correctamente.',
            origen: 'GIFTCARD'
          }
        });
      }

    } catch (error: any) {
      console.error("❌ Error en operación GiftCard:", error);

      let mensaje = "Ocurrió un problema al procesar la operación.";

      if (error?.status === 0) {
        mensaje = "Error de conexión con el servidor. Intente nuevamente.";
      } else if (typeof error?.error === 'string') {
        mensaje = error.error;
      } else if (error?.message) {
        mensaje = error.message;
      }

      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: false,
          titulo: 'Error en la operación',
          descripcion: mensaje,
          origen: 'GIFTCARD'
        }
      });
    }
  }



}
