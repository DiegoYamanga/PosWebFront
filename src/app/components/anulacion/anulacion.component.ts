import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ResTransactionCanheDTO } from '../../../DTOs/resTransactionCanjeDTO';
import { AppSelectors } from '../../redux/selectors';
import { Store } from '@ngrx/store';
import { ServiceLogic } from '../../../logic/serviceLogic';
import { TarjetaUsuarioComponent } from '../pop-ups/tarjeta-usuario/tarjeta-usuario.component';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { ReqCancelarTransaccionByID } from '../../../DTOs/reqCancelarTransaccionByID';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { ConfirmarAnulacionComponent } from '../pop-ups/confirmar-anulacion/confirmar-anulacion.component';



@Component({
  selector: 'app-anulacion',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './anulacion.component.html',
  styleUrl: './anulacion.component.css'
})
export class AnulacionComponent {

transacciones: ResTransactionCanheDTO[] = [];
  storeID!: string;
  branchID!: number;
  cargando = false;
  error: string | null = null;
  etapaSeleccion = true;
  transaccionSeleccionada: any = null;

  constructor(
    private serviceLogic: ServiceLogic,
    private store: Store,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
        this.storeID = loginData.store.id.toString();
        this.branchID = loginData.branch.id;
      }
    });

  }

  buscarPorDNI() {
    const dialogRef = this.dialog.open(IdentificacionUsuarioComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(async result => {
      if (result?.exitoso && result?.documento) {
        this.serviceLogic.setIdentificadorTransaccion(result.documento);
        await this.cargarTransacciones();
      }
    });
  }

  buscarPorTarjeta() {
    const dialogRef = this.dialog.open(TarjetaUsuarioComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(async result => {
      if (result?.exitoso && result?.tarjeta) {
        this.serviceLogic.setIdentificadorTransaccion(result.tarjeta);
        await this.cargarTransacciones();
      }
    });
  }

  async cargarTransacciones() {
    this.cargando = true;
    this.error = null;
    this.transacciones = [];

    try {
      let transTotales = await this.serviceLogic.buscarTransaccionesParaAnulacion(this.storeID);
      this.transacciones = transTotales.filter( t => t.status !== "cancelled" && t.branch_id === this.branchID && t.amount >= 0);
      console.log("TRANS: ", this.transacciones)
      this.etapaSeleccion = false;
    } catch (err: any) {
      this.error = err.message || 'Error al buscar transacciones.';
    } finally {
      this.cargando = false;
    }
  }

  anularTransaccion(trans: ResTransactionCanheDTO) {
    // Abrir el popup de confirmación
    const dialogRef = this.dialog.open(ConfirmarAnulacionComponent, {
      width: '400px',
      data: { id: trans.id }
    });

    // Esperar el resultado del popup
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return; // Si el usuario cancela, no hace nada


      this.cargando = true;
      this.error = null;

      if(trans.branch_id == null){
        
      }  


      const body: ReqCancelarTransaccionByID = {
        serial_number: "WEB",
        card_number: trans.card_number || null,
        identification: trans.user_identification || null,
        local_datetime: new Date().toISOString().slice(0, 19),
        branch_id: trans.branch_id.toString()
      };



      this.serviceLogic.anularTransaccion(this.storeID, trans.id.toString(), body)
        .then((respuesta) => {
          console.log("Respuesta Anulacion:",respuesta)
          // this.transacciones = this.transacciones.filter(t => t.id !== trans.id);
          this.dialog.open(NotificacionComponent, {
            panelClass: 'full-screen-dialog',
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100vh',
            width: '100vw',
            data: {
              success: true,
              titulo: 'Transacción anulada',
              descripcion: 'La transacción fue anulada correctamente.',
              origen: 'FIDELIDAD'
            }
          });
        
        })
        .catch((err) => {
          const mensaje = err?.message?.includes('La transacción no puede ser cancelada')
            ? 'La transacción no puede ser cancelada. Inténtelo nuevamente.'
            : 'No se pudo realizar la anulación. Inténtelo más tarde.';
            
            console.error("ERROR EN ANULACIÓN:", err);

          this.dialog.open(NotificacionComponent, {
            panelClass: 'full-screen-dialog',
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100vh',
            width: '100vw',
            data: {
              success: false,
              titulo: 'Error de anulación',
              descripcion: mensaje,
              origen: 'FIDELIDAD'
            }
          });
        })
        .finally(() => {
          this.cargando = false;
        });
    });
  }

}
