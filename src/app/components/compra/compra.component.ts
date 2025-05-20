import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { AppSelectors } from '../../redux/selectors';
import { NavigationService } from '../../../logic/navigationService';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { HeaderComponent } from "../header/header.component";
import { StateOrigenOperacionAction } from '../../redux/action';

@Component({
  standalone: true,
  selector: 'app-compra',
  imports: [CommonModule, MatDialogModule, HeaderComponent],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent {
  cliente: ResClienteDTO | undefined;

  constructor(private store: Store,
              private navigationService : NavigationService,
              private dialog: MatDialog,
  ) {
    this.store.select(AppSelectors.selectResClienteDTO)
    .subscribe(value => {
      console.log("Valueee------>",value);
      this.cliente = value;

    });
  }

  accionTarjeta(): void {
    console.log("TARJETA presionado");
  }

  accionQR(): void {
    console.log("QR presionado");
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
        }
      });
  }


}
