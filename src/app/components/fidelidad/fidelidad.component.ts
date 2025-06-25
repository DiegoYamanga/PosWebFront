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
import { AppSelectors } from '../../redux/selectors';
import { TarjetaUsuarioComponent } from '../pop-ups/tarjeta-usuario/tarjeta-usuario.component';
import { ServiceLogic } from '../../../logic/serviceLogic';

@Component({
  selector: 'app-fidelidad',
  imports: [HeaderComponent],
  templateUrl: './fidelidad.component.html',
  styleUrl: './fidelidad.component.css'
})
export class FidelidadComponent {

  storeID!: string;
  branchID!: string;
  result!: string;


  constructor(
    private navigation: NavigationService,
    private dialog: MatDialog,
    private store: Store,
    private endpointLogic: EndpointAdapterLogic,
    private logicService : ServiceLogic
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
    
  goToAnulacion() {
  this.navigation.goToAnulacion();
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
      width: '400px'
    });

    console.log("LEGO ACA POR LO MENOS:"); // ✅ DEBUG

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.exitoso && result?.documento) {
        const cliente = await this.endpointLogic.buscarCliente(this.storeID, this.branchID, result.documento);
          console.log("Cliente datos:", cliente); // ✅ DEBUG

        if (cliente) {
            console.log("Cliente recuperado:", cliente); // ✅ DEBUG
          this.dialog.open(ConsultarSaldoComponent, {
            width: '400px',
            data: { tipo: 'FIDELIDAD', cliente }
          });
        }
      }
    });
  }


}

