import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { AppSelectors } from '../../redux/selectors';
import { EncuestaDTO } from '../../../DTOs/encuestaDTO';
import { ServiceLogic } from '../../../logic/serviceLogic';
import { NavigationService } from '../../../logic/navigationService';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { TarjetaUsuarioComponent } from '../pop-ups/tarjeta-usuario/tarjeta-usuario.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { StateEncuestasAction } from '../../redux/action';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  templateUrl: './encuesta.component.html',
  imports: [CommonModule, HeaderComponent],
    styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {
  storeID: number | undefined;
  branchID: number | undefined;
  documento: string | undefined;
  numeroTarjeta: string | undefined;
  encuestas: EncuestaDTO[] = [];
  encuestasObtenidas: boolean = false;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private serviceLogic: ServiceLogic,
    private navigationService: NavigationService
  ) {
    // Obtener store y branch del login
    this.store.select(AppSelectors.selectResLoginDTO)
      .subscribe((login) => {
        this.storeID = login?.store.id;
        this.branchID = login?.branch.id;
        console.log("Encuesta Component -> Store: ",this.storeID," BranchId",this.branchID)
      });

    // Obtener documento
    this.store.select(AppSelectors.selectResClienteDTO)
      .subscribe((cliente) => {
        if (cliente?.datosCliente.identification) {
          this.documento = cliente.datosCliente.identification;
        }
        console.log("Encuesta Component -> Documento: ",this.documento)

      });
    this.store.select(AppSelectors.selectEncuestasDisponibles)
     .subscribe((encuestas) => {
      if (encuestas) {
      this.encuestas = encuestas;
      this.encuestasObtenidas = true;
     }
    });


      this.documento = serviceLogic.getDocumentoUsuario();
      console.log("Encuesta Component -> Documento: ",this.documento)



    // Obtener  /// ES LA TARJETA DE GIFT CARD? ----> O PUEDE SER OTRO NUMERO DE TARJETA ----> PARA MI NO TIENE SENTIDO PEDIR ESTO  ---> GUARDAR NUMERO DE TARJETA EN GLOBAL DE SER NECESARIO
    // this.store.select(AppSelectors)
    //   .subscribe((giftcard) => {
    //     if (giftcard?.numero) {
    //       this.numeroTarjeta = giftcard.numero;
    //     }
    //   });
  }

  onSeleccionar(tipo: 'tarjeta' | 'documento' | 'qr') {
  console.log("Encuesta Component -> tipo de indentificacion: ",tipo)

  if (tipo === 'qr') {
    this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
      data: { mensaje: 'Funcionalidad de QR no disponible aún.', tipo: 'info' }
    });
    return;
  }

  if (tipo === 'documento' && this.documento) {
    this.cargarEncuestas();
  } else if (tipo === 'tarjeta' && this.numeroTarjeta) {
    this.cargarEncuestas();
  } else {
    if (tipo === 'documento') {
      this.serviceLogic.setDocumentoUsuario(this.documento)
      const dialogRef = this.dialog.open(IdentificacionUsuarioComponent, {
        data: {} ,
        width: '400px',
        height: 'auto'
      }).afterClosed().subscribe((resultado) => {
        if (resultado?.exitoso && resultado.documento) {
          this.documento = resultado.documento;
          this.cargarEncuestas();
        }
      });
    }

    if (tipo === 'tarjeta') {
      const dialogRef = this.dialog.open(TarjetaUsuarioComponent, {
        data: {} ,
        width: '400px',
        height: 'auto'
      }).afterClosed().subscribe((resultado) => {
        if (resultado?.exitoso && resultado.nroTarjeta) {
          this.numeroTarjeta = resultado.nroTarjeta;
          this.cargarEncuestas();
        }
      });
    }
  }
}


  cargarEncuestas() {
    console.log("Encuesta - cargarEncuesta")
    if (this.storeID === undefined || this.branchID === undefined) {
      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: { mensaje: 'Datos de sesión incompletos (storeID o branchID no encontrados)', tipo: 'error' }
      });
      return;
    }

    this.serviceLogic.getEncuestas(this.storeID, this.branchID).subscribe({
      next: (respuesta: EncuestaDTO[]) => {
        console.log("Encuesta - Respuesta de la encuesta:", respuesta);
        this.encuestasObtenidas = true;
        this.encuestas = respuesta;

        // ✅ Guardar en Redux
        this.store.dispatch(
          StateEncuestasAction.setEncuestasDisponibles({ encuestas: respuesta })
        );
      },
      error: () => {
        this.dialog.open(NotificacionComponent, {
          panelClass: 'full-screen-dialog',
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100vh',
          width: '100vw',
          data: { mensaje: 'Error al obtener las encuestas.', tipo: 'error' }
        });
      }
    });
  }


  seleccionarEncuesta(encuesta: EncuestaDTO) {
    console.log("Encuesta - EncuestaSeleccionada:", encuesta.id);

    this.navigationService.goToEncuestaPreguntas({
      state: {
        storeID: this.storeID,
        branchID: this.branchID,
        pollID: encuesta.id,
        documento: this.documento,
        nroTarjeta: this.numeroTarjeta
      }
    });
  }

}
