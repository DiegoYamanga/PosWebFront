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

@Component({
  standalone : true,
  selector: 'app-gift-card',
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './gift-card.component.html',
  styleUrl: './gift-card.component.css'
})
export class GiftCardComponent {

  numeroTarjeta: string = '';
  saldo: number | null = 0;
  etapa: 'seleccion' | 'monto' = 'seleccion';
  titulo: string | undefined;

  constructor(private navigation: NavigationService,
              private store : Store,
              private dialog : MatDialog,
              private endpointAdapterLogic : EndpointAdapterLogic,
              private serviceLogic : ServiceLogic
  ) {}

  abrirPopupYGuardar(operacion: 'COMPRA' | 'CARGAR_SALDO' | 'ANULACION' | 'CONSULTAR_SALDO') {
    this.store.dispatch(StateGiftCardOperacionAction.setGiftCardOperacion({ operacion }));

    const dialogRef = this.dialog.open(TarjetaUsuarioComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((numeroTarjeta: string | null) => {
      console.log("Numero de tarjeta --->",numeroTarjeta)
      if (numeroTarjeta) {
        this.numeroTarjeta = numeroTarjeta;
        this.etapa = 'monto';

        // Cambiás el encabezado según la operación
        if (operacion === 'COMPRA') this.titulo = 'Monto de compra';
        else if (operacion === 'CARGAR_SALDO') this.titulo = 'Cargar saldo';
        else if (operacion === 'ANULACION') this.titulo = 'Anulación';
        else this.titulo = 'Consultar saldo';
        console.log("Que operacion estoy dando --->",operacion)
      }
    });
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
    const storeID = "32";
    const branchID = "43";
    const operacion = this.titulo;
    const tarjeta = this.numeroTarjeta;
    const monto = this.saldo;

    console.log("titulo-->",operacion)

    // Guardar en estado global
    this.store.dispatch(StateMontoGiftCardAction.setMontoGiftCard({ monto }));

    console.log("Estoy adentro para ir al back")
    try {
      if (operacion === 'Cargar saldo') {
        const result = await this.endpointAdapterLogic.cargarSaldoGiftCard(storeID, branchID, tarjeta, monto!);
        console.log("✔️ Carga exitosa:", result);
        // Podés mostrar mensaje de éxito, o redirigir
      }

    } catch (e) {
      console.error("❌ Error al cargar saldo:", e);
      // Mostrar error visual si querés
    }
  }



}
