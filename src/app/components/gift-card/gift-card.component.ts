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
import { SeleccionarSucursalComponent } from '../pop-ups/seleccionar-sucursal/seleccionar-sucursal.component';

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

  this.store.select(AppSelectors.selectResLoginDTO).subscribe(async loginData => {
    console.log("Login data:", loginData);

    if (loginData) {
      this.storeID = loginData.store.id.toString();

      const branchData = loginData.branch;

      //Caso 1: branch único
      if (branchData && !Array.isArray(branchData) && Object.keys(branchData).length > 0) {
        this.branchID = branchData.id.toString();
        console.log("Branch de sistema - branchID:", this.branchID);
      }

      //Caso 2: varias branches
      else if (Array.isArray(branchData) && branchData.length > 0) {
        const branchesArray = branchData.map(b => ({ id: b.id, name: b.name }));
        console.log("Varias branches encontradas:", branchesArray);

        const dialogRef = this.dialog.open(SeleccionarSucursalComponent, {
          width: '400px',
          data: { branches: branchesArray },
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.branchID = result.id.toString();
            console.log("Branch seleccionada: ", this.branchID);
          } else {
            console.warn("");
          }
        });
      }

      //Caso 3: branch vacío, para desarrollar mas adelante
      else if (branchData && Object.keys(branchData).length === 0) {
        console.log("Branch vacío, implementacion pendiente para consultar al backend y seleccionar sucursal.");
        // Desarrolar si Mati nos hace pegarle a otro endpoint
      }
    }
  });
}





  abrirPopupYGuardar(operacion: 'COMPRA' | 'CARGAR_SALDO' | 'ANULACION' | 'CONSULTAR_SALDO') {
    if (!this.storeID || !this.branchID) {
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
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(async (resultado: { exitoso: boolean, nroTarjeta?: string } | null) => {

      if (!resultado?.exitoso || !resultado.nroTarjeta) return;

      this.numeroTarjeta = resultado.nroTarjeta;


      try {
        const respuesta: GiftcardDTO = await this.endpointAdapterLogic.consultarSaldoGiftCard(this.storeID, this.numeroTarjeta);
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
          serial_number: 'WEB',
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
