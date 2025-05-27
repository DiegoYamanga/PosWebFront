// gift-card.component.ts (refactorizado y optimizado)

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  numeroTarjeta: string = '';
  saldo: number | null = 0;
  etapa: 'seleccion' | 'monto' = 'seleccion';
  titulo: string | undefined;
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
    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
          this.storeID = loginData.store.id.toString();
          this.branchID = loginData.branch.id.toString();
        console.log("ID de sucursal:", loginData.branch.id);
        console.log("ID de Store:", loginData.store.id);
        console.log("Token:", loginData.token);
        console.log("LOGIN DATA",loginData)
    }
    });
}




abrirPopupYGuardar(operacion: 'COMPRA' | 'CARGAR_SALDO' | 'ANULACION' | 'CONSULTAR_SALDO') {
  this.store.dispatch(StateGiftCardOperacionAction.setGiftCardOperacion({ operacion }));

  const dialogRef = this.dialog.open(TarjetaUsuarioComponent, {
    width: '400px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((numeroTarjeta: string | null) => {
    if (!numeroTarjeta) return;

    this.numeroTarjeta = numeroTarjeta;

    this.endpointAdapterLogic.consultarSaldoGiftCard(this.storeID, numeroTarjeta)
      .then((respuesta: GiftcardDTO) => {
        // Guardar respuesta
        this.serviceLogic.setGiftCardInfo(respuesta);

        // Si es CONSULTAR_SALDO, mostrar popup directamente
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
          // Continuar con etapa de monto para COMPRA, CARGAR_SALDO, ANULACION
          this.etapa = 'monto';
          if (operacion === 'COMPRA') this.titulo = 'Monto de compra';
          else if (operacion === 'CARGAR_SALDO') this.titulo = 'Cargar saldo';
          else if (operacion === 'ANULACION') this.titulo = 'Anulación';
        }
      })
      .catch(error => {
        const mensajeError = error?.error === "Giftcard no encontrada"
          ? "Giftcard no encontrada"
          : "Error. Vuelva a intentarlo más tarde.";

        this.dialog.open(NotificacionComponent, {
          width: '400px',
          data: {
            success: false,
            titulo: 'Error al verificar tarjeta',
            descripcion: mensajeError,
            origen: 'GIFTCARD'
          }
        });
      });
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

  console.log("Estoy en el CONFIRMAROPERACION");
  console.log("Operacion--->", operacion);

  this.store.dispatch(StateMontoGiftCardAction.setMontoGiftCard({ monto }));

  try {
    if (operacion === 'Cargar saldo') {
      const result = await this.endpointAdapterLogic.cargarSaldoGiftCard(this.storeID, this.branchID, tarjeta, monto!);
      console.log("✔️ Carga exitosa:", result);

      this.dialog.open(NotificacionComponent, {
        width: '400px',
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
      const response = await this.endpointAdapterLogic.anularTransaccion(this.storeID, tarjeta, cancelBody);
      console.log("✔️ Anulación exitosa:", response);

      this.dialog.open(NotificacionComponent, {
        width: '400px',
        data: {
          success: true,
          titulo: 'Anulación Exitosa',
          descripcion: 'La transacción fue anulada correctamente.',
          origen: 'GIFTCARD'
        }
      });

    } else if (operacion === 'Monto de compra') {
      try {
        const body: ReqGiftCardDatosDTO = {
          serial_number: 'MOBILE',
          card_number: tarjeta,
          amount: monto!,
          local_datetime: new Date().toISOString(),
          branch_id: this.branchID
        };

        const response = await this.endpointAdapterLogic.descargarSaldoGiftCard(this.storeID, body);
        console.log("✔️ Compra descargada:", response);

        this.serviceLogic.setUltimaOperacionGiftCard(response);

        this.dialog.open(NotificacionComponent, {
          width: '400px',
          data: {
            success: true,
            titulo: 'Operación Exitosa',
            descripcion: 'La compra fue realizada correctamente.',
            origen: 'GIFTCARD'
          }
        });

      } catch (e) {
        console.error("❌ Error al realizar la compra:", e);

        this.dialog.open(NotificacionComponent, {
          width: '400px',
          data: {
            success: false,
            titulo: 'Error en la operación',
            descripcion: 'No se pudo realizar la compra. Intente nuevamente.',
            origen: 'GIFTCARD'
          }
        });
      }
    }

  } catch (e) {
    console.error("❌ Error en operación GiftCard:", e);
    this.dialog.open(NotificacionComponent, {
      width: '400px',
      data: {
        success: false,
        titulo: 'Error',
        descripcion: 'Ocurrió un problema al procesar la operación.',
        origen: 'GIFTCARD'
      }
    });
  }
}


}
 