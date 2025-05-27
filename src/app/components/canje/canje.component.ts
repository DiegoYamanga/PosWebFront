import { Component, OnInit } from '@angular/core';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { AppSelectors } from '../../redux/selectors';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { NavigationService } from '../../../logic/navigationService';
import { StateOrigenOperacionAction } from '../../redux/action';

@Component({
  selector: 'app-canje',
  imports: [MatDialogModule],
  templateUrl: './canje.component.html',
  styleUrl: './canje.component.css'
})
export class CanjeComponent implements OnInit {


    tipoCanje: 'PUNTOS' | 'IMPORTE' | null = null;
    cliente: ResClienteDTO | undefined;

  constructor(private store: Store,
              private dialog: MatDialog,
              private navigation: NavigationService
  ) {}

  ngOnInit(): void {

    // Obtener el tipo de canje
    this.store.select(AppSelectors.selectTipoCanje).subscribe(tipo => {
      this.tipoCanje = tipo;
      console.log("Tipo de canje seleccionado:", tipo);
    });

    // Obtener los datos del cliente
    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      this.cliente = cliente;
      console.log("Cliente logueado:", cliente);
    });

  }


    abrirPopupIdentificacion() {
    const dialogRef = this.dialog.open(IdentificacionUsuarioComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((documentoIngresado) => {
      if (documentoIngresado?.exitoso) {
        this.store.dispatch(StateOrigenOperacionAction.setOrigenOperacion({ origen: 'CANJE' }));
        this.navigation.goToDNIDetallesOperacion();

      }
    });
  }




}
