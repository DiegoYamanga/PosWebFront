import { Component } from '@angular/core';
import { AppSelectors } from '../../redux/selectors';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { HeaderComponent } from "../header/header.component";
import { NavigationService } from '../../../logic/navigationService';
import { MatDialog } from '@angular/material/dialog';
import { TipoCanjeDialogoComponent } from '../tipo-canje-dialogo/tipo-canje-dialogo.component';
import { StateTipoCanjeAction } from '../../redux/action';
@Component({
  selector: 'app-dni-detalles-operacion',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './dni-detalles-operacion.component.html',
  styleUrl: './dni-detalles-operacion.component.css'
})
export class DniDetallesOperacionComponent {
  cliente: ResClienteDTO | undefined;
  etapa: 'monto' | 'detalle' | 'firma' = 'monto';
  monto: string = '';
  nombreFirmado: string = '';
  tipoCanje$: any;
  origenOperacion: 'CANJE' | 'COMPRA' | null = null;


  constructor(private store: Store,
              private endpointAdapterlogic : EndpointAdapterLogic,
              private navigation: NavigationService,
              private dialog : MatDialog
  ) {

    this.tipoCanje$ = this.store.select(AppSelectors.selectTipoCanje);

  }

  

  ngOnInit(): void {

    this.store.select(AppSelectors.selectOrigenOperacion).subscribe(origen => {
    this.origenOperacion = origen;
    });

    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      this.cliente = cliente;
      console.log("Cliente desde Redux:", cliente);
    });

    this.tipoCanje$.subscribe((tipo: any) => {
    console.log('Tipo de canje seleccionado:', tipo);
    });
    }
  

  // agregarNumero(valor: string) {
  //   this.monto += valor;
  // }

  // borrarUltimo() {
  //   this.monto = this.monto.slice(0, -1);
  // }

  confirmarMonto() {
    if (!this.monto) return;

    if (this.origenOperacion === 'CANJE') {
      const dialogRef = this.dialog.open(TipoCanjeDialogoComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((opcion: 'IMPORTE' | 'PUNTOS') => {
        if (opcion) {
          this.store.dispatch(StateTipoCanjeAction.setTipoCanje({ tipoCanje: opcion }));
          this.etapa = 'detalle'; // solo pasar a etapa 2 después del popup
        }
      });
    } else {
      this.etapa = 'detalle'; // flujo directo si no viene de CANJE
    }
  }


  continuarAFirma() {
    // this.etapa = 'firma';
    this.navigation.goToNotificacion();
  }

  confirmarOperacion() {
    console.log("Nombre firmado:", this.nombreFirmado);
  }

  calcularPuntos(monto: string): number {
  const valor = parseFloat(monto.replace(',', '.'));
  return valor * 0.1;
  }

  onConfirmar() {
    if (this.origenOperacion === 'CANJE') {
      const dialogRef = this.dialog.open(TipoCanjeDialogoComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((opcion: 'IMPORTE' | 'PUNTOS') => {
        if (opcion) {
          this.store.dispatch(StateTipoCanjeAction.setTipoCanje({ tipoCanje: opcion }));
          // continuar flujo de canje...
        }
      });
    } else {
      // seguir flujo normal para compras u otros
      console.log("Flujo alternativo sin popup");
    }
  }




}
