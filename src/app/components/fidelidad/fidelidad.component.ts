import { Component } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { HeaderComponent } from "../header/header.component";
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TipoCanjeDialogoComponent } from '../tipo-canje-dialogo/tipo-canje-dialogo.component';
import { StateTipoCanjeAction } from '../../redux/action';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { ConsultarSaldoComponent } from '../pop-ups/consultar-saldo/consultar-saldo.component';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';

@Component({
  selector: 'app-fidelidad',
  imports: [HeaderComponent],
  templateUrl: './fidelidad.component.html',
  styleUrl: './fidelidad.component.css'
})
export class FidelidadComponent {

  constructor(
    private navigation: NavigationService,
    private dialog: MatDialog,
    private store: Store,
    private endpointLogic: EndpointAdapterLogic
  ) {}

  goToCompras() {
    this.navigation.goToCompras();
  }

  goToSorteo() {
    this.navigation.goToSorteo();
  }

  goToCanje() {
    this.navigation.goToCanje();
  }

  goToGiftCard() {
    this.navigation.goToGiftCard();
  }

  abrirTipoCanjePopup() {
    const dialogRef = this.dialog.open(TipoCanjeDialogoComponent);

    dialogRef.afterClosed().subscribe((opcion: 'IMPORTE' | 'PUNTOS') => {
      if (opcion) {
        this.store.dispatch(StateTipoCanjeAction.setTipoCanje({ tipoCanje: opcion }));
        this.navigation.goToCanje();
      }
    });
  }

  abrirPopupConsultarSaldo() {
    const dialogRef = this.dialog.open(IdentificacionUsuarioComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.exitoso && result?.documento) {
        const cliente = await this.endpointLogic.buscarCliente("32", "43", result.documento);
        if (cliente) {
          this.dialog.open(ConsultarSaldoComponent, {
            width: '400px',
            data: { tipo: 'FIDELIDAD', cliente }
          });
        }
      }
    });
  }

}
