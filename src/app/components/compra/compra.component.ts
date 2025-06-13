import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { AppSelectors } from '../../redux/selectors';
import { NavigationService } from '../../../logic/navigationService';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { HeaderComponent } from "../header/header.component";
import { StateOrigenOperacionAction, StateResClienteDTOAction } from '../../redux/action';
import { TarjetaUsuarioComponent } from '../pop-ups/tarjeta-usuario/tarjeta-usuario.component';

@Component({
  standalone: true,
  selector: 'app-compra',
  imports: [CommonModule, MatDialogModule, HeaderComponent],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent {
  cliente: ResClienteDTO | undefined;
  storeID!: string;
  branchID!: string;

  constructor(private store: Store,
              private navigationService : NavigationService,
              private dialog: MatDialog,
  ) {
    this.store.select(AppSelectors.selectResClienteDTO)
    .subscribe(value => {
      console.log("Valueee------>",value);
      this.cliente = value;

    });
    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
          this.storeID = loginData.store.id.toString();
          this.branchID = loginData.branch.id.toString();
        console.log("ID de sucursal:", loginData.branch.id);
        console.log("ID de Store:", loginData.store.id);
    }
    });


  }

  accionTarjeta(): void {
    const dialogRef = this.dialog.open(TarjetaUsuarioComponent, {
      data: {},
      width: '400px',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.exitoso) {
        this.store.dispatch(StateOrigenOperacionAction.setOrigenOperacion({ origen: 'COMPRA' }));
        this.navigationService.goToTarjetaDetallesOperacion(); // 🔁 NUEVO
      }
    });
  }


  accionQR(): void {
    console.log("QR presionado");
    this.navigationService.goToQRScanner();
  }

  goToIdentificacionUsuario(): void {
    const dialogRef = this.dialog.open(IdentificacionUsuarioComponent, {
        data: {} ,
        width: '400px',
        height: 'auto'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.exitoso) {
          this.store.dispatch(StateOrigenOperacionAction.setOrigenOperacion({ origen: 'COMPRA' }));
          this.navigationService.goToDNIDetallesOperacion();
        } else{
          
        }
      });
  }


}
