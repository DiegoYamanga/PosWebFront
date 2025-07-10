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
import { reqTransactionsFidelidad } from '../../../DTOs/reqTransactionsFidelidad';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { ReqSwapDTO } from '../../../DTOs/reqSwapDTO';
import { SessionLogic } from '../../../logic/sessionLogic';
import { NumeroTicketComponent } from '../pop-ups/numero-ticket/numero-ticket.component';

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
  storeID: string = '';
  branchID: string = '';
  nroTarjeta: string = '';
  tipoCanje: 'PUNTOS' | 'IMPORTE' | null = null;
  loginSpinner: boolean = false;
  nroTicket: string = '';
  dayNumber : number = 0;
  pointsDayString : string | undefined;
  pointsMultiplier : number = 0;
  obtainedPoints : number = 0;


  constructor(private store: Store,
              private endpointAdapterlogic : EndpointAdapterLogic,
              private navigation: NavigationService,
              private dialog : MatDialog,
              private sessionLogic : SessionLogic
  ) {
    this.tipoCanje$ = this.store.select(AppSelectors.selectTipoCanje);
  }

  ngOnInit(): void {
    this.store.select(AppSelectors.selectOrigenOperacion).subscribe(origen => {
      this.origenOperacion = origen;
    });

    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      this.cliente = cliente;
      console.log("CLIENTE EN COMPRA: ", this.cliente)
    });

    this.tipoCanje$.subscribe((tipo: any) => {
      this.tipoCanje = tipo;
      console.log('Tipo de canje seleccionado:', tipo);
    });


    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
        this.storeID = loginData.store.id.toString();
        this.branchID = loginData.branch.id.toString();
      }
    });
  }

async confirmarMonto() {
  if (!this.monto) return;
  console.log("Confirmo Monto --> quiero ticket?",this.sessionLogic.getPedirNumeroTicket())

  if (this.sessionLogic.getPedirNumeroTicket() == 1) {
    const dialogRef = this.dialog.open(NumeroTicketComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe((nroTicket: number | null) => {
      if (nroTicket) {
        this.nroTicket = nroTicket.toString();
        this.procederEtapa();
      }
    });
  } else {
    this.procederEtapa();
  }
}

procederEtapa() {
  if (this.origenOperacion === 'CANJE') {
    const dialogRef = this.dialog.open(TipoCanjeDialogoComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((opcion: 'IMPORTE' | 'PUNTOS') => {
      if (opcion) {
        this.store.dispatch(StateTipoCanjeAction.setTipoCanje({ tipoCanje: opcion }));
        // this.getBenefits()
        this.etapa = 'detalle';
      }
    });
  } else {
    this.etapa = 'detalle';
    this.getBenefits()
    }
  }



  async confirmarOperacion() {

    if (!this.cliente || !this.monto) return;
    this.loginSpinner = true;

    const payload: reqTransactionsFidelidad = {
      serial_number: 'MOBILE',
      identification: this.cliente.datosCliente.identification,
      amount: parseFloat(this.monto),
      local_datetime: new Date().toISOString(),
      branch_id: this.branchID
    };

    try {

      if(this.origenOperacion === "CANJE"){
        this.confirmarCanje(this.tipoCanje$);
        console.log("Salgo de aca")
        this.loginSpinner = false;
        return;
      }

      const result = await this.endpointAdapterlogic.crearTransaccionFidelidad(this.storeID, payload);
      console.log("Obtuve la transaccion por fidelidad?")
      console.log("Transacción Fidelidad registrada:", result);

      this.loginSpinner = false;
      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: true,
          titulo: 'Operación Exitosa',
          descripcion: 'La transacción fue realizada correctamente.',
          origen: 'FIDELIDAD'
        }
      });
      this.navigation.goToInicio();
    } catch (e) {
      console.error("❌ Error al registrar transacción Fidelidad:", e);
      this.loginSpinner = false;
      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: false,
          titulo: 'Error',
          descripcion: 'No se pudo registrar la transacción. Intente más tarde.',
          origen: 'FIDELIDAD'
        }
      });
    }
  }

  calcularPuntos(monto: string): number {
    const valor = parseFloat(monto.replace(',', '.'));
    return valor * 0.1;
  }

  // onConfirmar() {
  //   if (this.origenOperacion === 'CANJE') {
  //     console.log("ENTRE AL onConfirmar CANJE")
  //     const dialogRef = this.dialog.open(TipoCanjeDialogoComponent, {
  //       width: '400px',
  //       disableClose: true
  //     });

  //     dialogRef.afterClosed().subscribe((opcion: 'IMPORTE' | 'PUNTOS') => {
  //       if (opcion) {
  //         this.store.dispatch(StateTipoCanjeAction.setTipoCanje({ tipoCanje: opcion }));
  //         // continuar flujo de canje...
  //       }
  //     });
  //   } else {
  //     // seguir flujo normal para compras u otros
  //     console.log("Flujo alternativo sin popup");
  //   }
  // }

  async confirmarCanje(tipoCanje : String) : Promise<void> {
  const cliente = this.cliente; // ya lo tenés cargado del selector
  const tipo = this.tipoCanje$;
  const monto = this.monto;

  console.log("Como me llega los campos",cliente+tipo+monto)

  if (!cliente || !tipo || !monto || !this.storeID || !this.branchID) {
    this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
        success: false,
        titulo: 'Datos incompletos',
        descripcion: 'Faltan datos para realizar el canje.',
        origen: 'FIDELIDAD'
      }
    });
    return;
  }

const reqSwapDTO: ReqSwapDTO = {
  serial_number: 'MOBILE',
  card_number: this.nroTarjeta, // string
  identification: this.cliente?.datosCliente?.identification, // string
  amount: parseFloat(this.monto), // number
  type: this.tipoCanje!, // 'PUNTOS' | 'IMPORTE'
  local_datetime: new Date().toISOString(), // string
  branch_id: this.branchID // string
};


  try {
    const respuesta = await this.endpointAdapterlogic.crearTransaccionSwap(this.storeID, reqSwapDTO);

    this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
      data: {
        success: true,
        titulo: 'Canje exitoso',
        descripcion: `Se realizó el canje correctamente.`,
        origen: 'FIDELIDAD'
      }
    });
  } catch (error: any) {
    console.error("Error al realizar canje:", error);

    this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
      data: {
        success: false,
        titulo: 'Error en el canje',
        descripcion: error.message || 'Ocurrió un error inesperado.',
        origen: 'FIDELIDAD'
      }
    });
    }

  }

  getBenefits() {
    let date = new Date;
    this.dayNumber= date.getDay() == 0 ? 7 : date.getDay()   // Si me devuelve 0 -> domingo (dia 7), sino es el numero que llega
    // this.discountDayString = "discount_" + this.dayNumber;
    this.pointsDayString = "points_" + this.dayNumber;
    // this.discountPercentage = this.selectedBranch[this.discountDayString]
    this.pointsMultiplier = Number(this.cliente?.tipoCliente[this.pointsDayString] ?? 0);
    console.log("pointsMultiplier: ", this.pointsMultiplier)

    if(this.monto != null){
      // this.discountToMade = this.purchaseAmount*this.discountPercentage/100;
      // this.finalAmount = this.purchaseAmount - this.discountToMade;
      this.obtainedPoints = Number(this.monto)*this.pointsMultiplier/100;
    }
  }



}
