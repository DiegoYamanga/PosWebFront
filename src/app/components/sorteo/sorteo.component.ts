import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { LotsDTO } from '../../../DTOs/lotsDTO';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { AppSelectors } from '../../redux/selectors';
import { StateResLotsDTOAction } from '../../redux/action';
import { IdentificacionUsuarioComponent } from '../pop-ups/identificacion-usuario/identificacion-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { TarjetaUsuarioComponent } from '../pop-ups/tarjeta-usuario/tarjeta-usuario.component';
import { HeaderComponent } from '../header/header.component';
import { ReqParticipacionSorteoDTO } from '../../../DTOs/reqParticipacionSorteo';
import { NotificacionComponent } from '../notificacion/notificacion.component';



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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      this.clienteInfo = cliente;
    });

    this.store.select(AppSelectors.selectResLotsDTO).subscribe(lots => {
      if (lots && lots.length > 0) {
        this.sorteos = lots;
        this.etapa = 'sorteos';
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
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(numeroTarjeta => {
      if (numeroTarjeta) {
        console.log("Tarjeta sorteada:", numeroTarjeta);
      }
    });
  }

  abrirPopDocumento() {
    const dialogRef = this.dialog.open(IdentificacionUsuarioComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async data => {
      if (data?.exitoso && this.clienteInfo) {
        try {
          //Validamos storeID y branchID ANTES de continuar
          if (!this.storeID || !this.branchID) {
            this.dialog.open(NotificacionComponent, {
              width: '400px',
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
          this.store.dispatch(StateResLotsDTOAction.setLotsDTO({ reslotsDTO: sorteos }));
        } catch (error) {
          console.error("❌ Error al obtener sorteos:", error);

          this.dialog.open(NotificacionComponent, {
            width: '400px',
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


  escanearQR() {
    console.log("Lógica escanear QR todavía no implementada");
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

      if (!puedeParticipar) {
        this.dialog.open(NotificacionComponent, {
          width: '400px',
          data: {
            success: false,
            titulo: 'No puede participar',
            descripcion: 'El cliente no puede participar en este sorteo.',
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
        width: '400px',
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
        width: '400px',
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