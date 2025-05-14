import { Component } from '@angular/core';
import { EndpointAdapterLogic } from '../../../../logic/endpointAdapterLogic';
import { SessionLogic } from '../../../../logic/sessionLogic';
import { Store } from '@ngrx/store';
import { ServiceLogic } from '../../../../logic/serviceLogic';
import { ResClienteDTO } from '../../../../DTOs/resClienteDTO';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../../logic/navigationService';
import { StateResClienteDTOAction } from '../../../redux/action';

@Component({
  selector: 'app-identificacion-usuario',
  imports: [CommonModule, FormsModule],providers: [ServiceLogic],
  templateUrl: './identificacion-usuario.component.html',
  styleUrl: './identificacion-usuario.component.css'
})
export class IdentificacionUsuarioComponent {

  documento: string = '';
  error: string | null = null;

  constructor(
    private logic: EndpointAdapterLogic,
    private session: SessionLogic,
    private serviceLogic : ServiceLogic,
    private store: Store,
    private navigation : NavigationService
  ) {}

  async buscarCliente() {

    try {
      const cliente = await this.logic.buscarCliente("32", "45", this.documento);
      console.log("Cliente---->",cliente)
      this.serviceLogic.setCliente(cliente);
      this.store.dispatch(StateResClienteDTOAction.setClienteDTO({ resClienteDTO: cliente }));
      this.error = null;
      console.log("Cliente : ",cliente);
    } catch (e) {
      this.error = 'No se encontró el cliente';
    }
    this.navigation.goToDNIDetallesOperacion();
  }
}
function setClienteDTO(arg0: { cliente: ResClienteDTO; }): any {
  throw new Error('Function not implemented.');
}

