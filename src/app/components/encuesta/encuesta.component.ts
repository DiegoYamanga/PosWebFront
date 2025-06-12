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

@Component({
  selector: 'app-encuesta',
  standalone: true,
  templateUrl: './encuesta.component.html',
  imports: [CommonModule],
    styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {
  storeID: number | undefined;
  branchID: number | undefined;
  documento: string | undefined;
  numeroTarjeta: string | undefined;
  encuestas: EncuestaDTO[] = [];

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
      });

    // Obtener documento
    this.store.select(AppSelectors.selectResClienteDTO)
      .subscribe((cliente) => {
        if (cliente?.datosCliente.identification) {
          this.documento = cliente.datosCliente.identification;
        }
      });

    // Obtener  /// ES LA TARJETA DE GIFT CARD? ----> O PUEDE SER OTRO NUMERO DE TARJETA ----> PARA MI NO TIENE SENTIDO PEDIR ESTO  ---> GUARDAR NUMERO DE TARJETA EN GLOBAL DE SER NECESARIO
    // this.store.select(AppSelectors)
    //   .subscribe((giftcard) => {
    //     if (giftcard?.numero) {
    //       this.numeroTarjeta = giftcard.numero;
    //     }
    //   });
  }

onSeleccionar(tipo: 'tarjeta' | 'documento' | 'qr') {
  if (tipo === 'qr') {
    this.dialog.open(NotificacionComponent, {
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
      this.dialog.open(IdentificacionUsuarioComponent, {
        disableClose: true,
        data: {}
      }).afterClosed().subscribe((resultado) => {
        if (resultado?.exitoso && resultado.documento) {
          this.documento = resultado.documento;
          this.cargarEncuestas();
        }
      });
    }

    if (tipo === 'tarjeta') {
      this.dialog.open(TarjetaUsuarioComponent, {
        disableClose: true,
        data: {}
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
  if (this.storeID === undefined || this.branchID === undefined) {
    this.dialog.open(NotificacionComponent, {
      data: { mensaje: 'Datos de sesión incompletos (storeID o branchID no encontrados)', tipo: 'error' }
    });
    return;
  }

  this.serviceLogic.getEncuestas(this.storeID, this.branchID).subscribe({
    next: (respuesta: EncuestaDTO[]) => {
      this.encuestas = respuesta;
    },
    error: () => {
      this.dialog.open(NotificacionComponent, {
        data: { mensaje: 'Error al obtener las encuestas.', tipo: 'error' }
      });
    }
  });
}


seleccionarEncuesta(encuesta: EncuestaDTO) {
  this.navigationService.goToEncuestaPreguntas(), {
    state: {
      storeID: this.storeID,
      branchID: this.branchID,
      pollID: encuesta.id,
      documento: this.documento,
      nroTarjeta: this.numeroTarjeta
    }
  };
}
}
