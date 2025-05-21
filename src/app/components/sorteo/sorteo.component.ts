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
          const storeID = Number(this.clienteInfo.tipoCliente.store_id);
          const branchID = Number(this.clienteInfo.tipoCliente.branch_id);
          const sorteos = await this.endpointLogic.obtenerSortosStore(storeID, branchID);
          this.store.dispatch(StateResLotsDTOAction.setLotsDTO({ reslotsDTO: sorteos }));
        } catch (error) {
          console.error("Error al obtener sorteos:", error);
        }
      }
    });
  }

  escanearQR() {
    console.log("Lógica escanear QR todavía no implementada");
  }

    async participarEnSorteo(sorteo: LotsDTO) {
    if (!this.clienteInfo) return;

    const storeID = this.clienteInfo.tipoCliente.store_id;
    const branchID = this.clienteInfo.tipoCliente.branch_id;
    const lookup = this.clienteInfo.datosCliente.identification;

    try {
      const puedeParticipar = await this.endpointLogic.verificarParticipacion(storeID, branchID, sorteo.id, lookup);
      console.log("Puede participar:", puedeParticipar);

      if (!puedeParticipar) {
        console.log("No puede participar en el sorteo");
        return;
      }

      const req: ReqParticipacionSorteoDTO = {
        identification: this.clienteInfo.datosCliente.identification,
        card_number: this.clienteInfo.datosCliente.identification
      };

      const response = await this.endpointLogic.generarParticipacion(storeID, branchID, sorteo.id, lookup, req);
      console.log("Participación generada exitosamente:", response);

    } catch (error) {
      console.error("Error al procesar participación:", error);
    }
  }
}