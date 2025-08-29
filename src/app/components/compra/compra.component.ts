import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { AppSelectors } from '../../redux/selectors';
import { NavigationService } from '../../../logic/navigationService';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { HeaderComponent } from "../header/header.component";
import { StateFromComponent, StateOrigenOperacionAction, StateResClienteDTOAction } from '../../redux/action';
import { TarjetaUsuarioComponent } from '../pop-ups/tarjeta-usuario/tarjeta-usuario.component';
import { ServiceLogic } from '../../../logic/serviceLogic';
import { SeleccionarSucursalComponent } from '../pop-ups/seleccionar-sucursal/seleccionar-sucursal.component';

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
              private serviceLogic: ServiceLogic
  ) {
    this.store.select(AppSelectors.selectResClienteDTO)
    .subscribe(value => {
      this.cliente = value;

    });
this.store.select(AppSelectors.selectResLoginDTO).subscribe(async loginData => {
    console.log("Login data:", loginData);

    if (loginData) {
      this.storeID = loginData.store.id.toString();

      const branchData = loginData.branch;

      //Caso 1: branch único
      if (branchData && !Array.isArray(branchData) && Object.keys(branchData).length > 0) {
        this.branchID = branchData.id.toString();
        console.log("Una sola branch: ", this.branchID);
      }

      //Caso 2: varias branches
      else if (Array.isArray(branchData) && branchData.length > 0) {
        const branchesArray = branchData.map(b => ({ id: b.id, name: b.name }));
        console.log("Varias branches encontradas:", branchesArray);

        const dialogRef = this.dialog.open(SeleccionarSucursalComponent, {
          width: '400px',
          data: { branches: branchesArray }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.branchID = result.id.toString();
            console.log("Branch seleccionada, branchID:", this.branchID);
          } else {
            console.warn("No se seleccionó ninguna sucursal, el flujo no continuará hasta que seleccione.");
          }
        });
      }

      //Caso 3: branch vacío, para desarrollar mas adelante
      else if (branchData && Object.keys(branchData).length === 0) {
        console.log("Branch vacío, implementacion pendiente para consultar al backend y seleccionar sucursal.");
        // Por si Mati nos hace pegarle a otro endpoint
      }
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
        this.serviceLogic.setOrigenOperacionTarjeta('COMPRA');
        this.navigationService.goToTarjetaDetallesOperacion();
      }
    });
  }


  accionQR(): void {
    console.log("QR presionado");
    this.store.dispatch(StateFromComponent.setFromComponent({ fromComponent: 'FIDELIDADCOMPRA' }));
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
