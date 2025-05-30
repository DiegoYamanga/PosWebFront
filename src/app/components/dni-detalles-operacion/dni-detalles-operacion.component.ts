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



  async confirmarOperacion() {
    if (!this.cliente || !this.monto) return;

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
        return;
      }

      const result = await this.endpointAdapterlogic.crearTransaccionFidelidad(this.storeID, payload);
      console.log("Obtuve la transaccion por fidelidad?")
      console.log("✔️ Transacción Fidelidad registrada:", result);

      this.dialog.open(NotificacionComponent, {
        width: '800px',
        data: {
          success: true,
          titulo: 'Operación Exitosa',
          descripcion: 'La transacción fue realizada correctamente.',
          origen: 'FIDELIDAD'
        }
      });
    } catch (e) {
      console.error("❌ Error al registrar transacción Fidelidad:", e);

      this.dialog.open(NotificacionComponent, {
        width: '800px',
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
      width: '400px',
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
      width: '400px',
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
      width: '400px',
      data: {
        success: false,
        titulo: 'Error en el canje',
        descripcion: error.message || 'Ocurrió un error inesperado.',
        origen: 'FIDELIDAD'
      }
    });
    }

  }


  

}
