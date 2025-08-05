import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { LotsDTO } from '../../../DTOs/lotsDTO';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { AppSelectors } from '../../redux/selectors';
import { StateFromComponent, StateResLotsDTOAction } from '../../redux/action';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { TarjetaUsuarioComponent } from '../pop-ups/tarjeta-usuario/tarjeta-usuario.component';
import { HeaderComponent } from '../header/header.component';
import { ReqParticipacionSorteoDTO } from '../../../DTOs/reqParticipacionSorteo';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { NavigationService } from '../../../logic/navigationService';



@Component({
  standalone: true,
  selector: 'app-sorteo',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.css']
})
export class SorteoComponent implements OnInit {
  sorteos: LotsDTO[] = [];
  clienteInfo: ResClienteDTO | undefined;
  etapa: 'inicio' | 'sorteos' = 'inicio';
  storeID!: number;
  branchID!: number;

  constructor(
    private store: Store,
    private endpointLogic: EndpointAdapterLogic,
    private dialog: MatDialog,
    private navigationService : NavigationService,
  ) {}

  ngOnInit(): void {
    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      this.clienteInfo = cliente;
    });

    this.store.select(AppSelectors.selectFromComponent).subscribe(fromComp => {
      if(fromComp != "") this.etapa = "sorteos"
    });

    this.store.select(AppSelectors.selectResLotsDTO).subscribe(lots => {
      if (lots && lots.length > 0) {
        this.sorteos = lots;
        // this.etapa = 'sorteos';
      }
    });

    this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
      if (loginData) {
        this.storeID = loginData.store.id;
        this.branchID = loginData.branch.id;
        console.log("ID de sucursal:", loginData.branch.id);
        console.log("ID de Store:", loginData.store.id);
        console.log("Token:", loginData.token);
        console.log("LOGIN DATA",loginData)
      }
    });
  }

  abrirPopTarjeta() {
    const dialogRef = this.dialog.open(TarjetaUsuarioComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(numeroTarjeta => {
      if (numeroTarjeta) {
        console.log("Tarjeta sorteada:", numeroTarjeta);
      }
    });
  }

  abrirPopDocumento() {
    const dialogRef = this.dialog.open(IdentificacionUsuarioComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async data => {
      if (data?.exitoso && this.clienteInfo) {
        try {
          // Validamos storeID y branchID ANTES de continuar
          if (!this.storeID || !this.branchID) {
            this.dialog.open(NotificacionComponent, {
              panelClass: 'full-screen-dialog',
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100vh',
              width: '100vw',
              data: {
                success: false,
                titulo: 'Error de autenticación',
                descripcion: 'No se pudo obtener la información del login. Vuelva a iniciar sesión.',
                origen: 'SORTEO'
              }
            });
            return;
          }

          const sorteos = await this.endpointLogic.obtenerSortosStore(this.storeID, this.branchID);

          // ✅ Validar si viene vacío o null
          if (!sorteos || sorteos.length === 0) {
            this.dialog.open(NotificacionComponent, {
              panelClass: 'full-screen-dialog',
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '100vh',
              width: '100vw',
              data: {
                success: false,
                titulo: 'Sin sorteos',
                descripcion: 'No hay sorteos disponibles.',
                origen: 'SORTEO'
              }
            });
            return;
          }

          this.store.dispatch(StateResLotsDTOAction.setLotsDTO({ reslotsDTO: sorteos }));
          this.etapa = "sorteos";

        } catch (error) {
          console.error("❌ Error al obtener sorteos:", error);

          this.dialog.open(NotificacionComponent, {
            panelClass: 'full-screen-dialog',
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100vh',
            width: '100vw',
            data: {
              success: false,
              titulo: 'Error',
              descripcion: 'No se pudieron obtener los sorteos. Intente más tarde.',
              origen: 'SORTEO'
            }
          });
        }
      }
    });
  }



  async escanearQR() {
    const sorteos = await this.endpointLogic.obtenerSortosStore(this.storeID, this.branchID);
    this.store.dispatch(StateResLotsDTOAction.setLotsDTO({ reslotsDTO: sorteos }));
    this.store.dispatch(StateFromComponent.setFromComponent({ fromComponent: 'SORTEO' }));
    this.navigationService.goToQRScanner();
  }

  async participarEnSorteo(sorteo: LotsDTO) {
    if (!this.clienteInfo) return;

    const lookup = this.clienteInfo.datosCliente.identification;

    try {
      const puedeParticipar = await this.endpointLogic.verificarParticipacion(
        this.storeID,
        this.branchID,
        sorteo.id,
        lookup
      );

      console.log("Puede participar?",puedeParticipar)

      if (!puedeParticipar) {
        this.dialog.open(NotificacionComponent, {
          panelClass: 'full-screen-dialog',
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100vh',
          width: '100vw',
          data: {
            success: false,
            titulo: 'No puede participar',
            descripcion: 'El cliente llegó al maximo de participaciones en este sorteo.',
            origen: 'SORTEO'
          }
        });
        return;
      }

      const req: ReqParticipacionSorteoDTO = {
        identification: lookup,
        card_number: lookup
      };

      const response = await this.endpointLogic.generarParticipacion(
        this.storeID,
        this.branchID,
        sorteo.id,
        lookup,
        req
      );

      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: true,
          titulo: 'Participación exitosa',
          descripcion: 'Estás suscripto al sorteo.',
          origen: 'SORTEO'
        }
      });

    } catch (error) {
      console.error("Error al generar participación:", error);

      this.dialog.open(NotificacionComponent, {
        panelClass: 'full-screen-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100vh',
        width: '100vw',
        data: {
          success: false,
          titulo: 'Error',
          descripcion: 'Error al generar participación. Intente más tarde.',
          origen: 'SORTEO'
        }
      });
    }
  }

}
