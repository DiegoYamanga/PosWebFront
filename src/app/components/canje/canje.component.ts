import { Component, OnInit } from '@angular/core';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { AppSelectors } from '../../redux/selectors';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { NavigationService } from '../../../logic/navigationService';
import { StateOrigenOperacionAction } from '../../redux/action';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { DatosGlobalService } from '../../../logic/datosGlobalService';

@Component({
  selector: 'app-canje',
  imports: [MatDialogModule,CommonModule, HeaderComponent],
  templateUrl: './canje.component.html',
  styleUrl: './canje.component.css'
})
export class CanjeComponent implements OnInit {


  tipoCanje: 'PUNTOS' | 'IMPORTE' | null = null;
  cliente: ResClienteDTO | undefined;
  storeID!: string;
  branchID!: string;

  constructor(private store: Store,
              private dialog: MatDialog,
              private navigation: NavigationService,
              private datosGlobalesService: DatosGlobalService
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

    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
          this.storeID = loginData.store.id.toString();
          this.branchID = loginData.branch.id.toString();
        console.log("ID de sucursal:", loginData.branch.id);
        console.log("ID de Store:", loginData.store.id);
    }
    });

  }


    abrirPopupIdentificacion() {
    const dialogRef = this.dialog.open(IdentificacionUsuarioComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((documentoIngresado) => {
      if (documentoIngresado?.exitoso) {
        this.store.dispatch(StateOrigenOperacionAction.setOrigenOperacion({ origen: 'CANJE' }));
        this.navigation.goToDNIDetallesOperacion();

      }
    });
  }






}
