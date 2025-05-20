import { Component, Inject, Optional } from '@angular/core';
import { EndpointAdapterLogic } from '../../../../logic/endpointAdapterLogic';
import { SessionLogic } from '../../../../logic/sessionLogic';
import { Store } from '@ngrx/store';
import { ServiceLogic } from '../../../../logic/serviceLogic';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../../logic/navigationService';
import { StateResClienteDTOAction } from '../../../redux/action';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-identificacion-usuario',
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule],
  providers: [ServiceLogic],
  templateUrl: './identificacion-usuario.component.html',
  styleUrl: './identificacion-usuario.component.css'
})
export class IdentificacionUsuarioComponent {

  documento: string = '';
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private logic: EndpointAdapterLogic,
    private session: SessionLogic,
    private serviceLogic : ServiceLogic,
    private store: Store,
    private navigation : NavigationService,
    private dialogRef: MatDialogRef<IdentificacionUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async buscarCliente() {

    this.loading = true;
    try {
      const cliente = await this.logic.buscarCliente("32", "45", this.documento);
      if(!cliente){
        this.error= "No se encontró cliente";
        this.loading = false;
        return;
      }
      console.log("Cliente---->",cliente)
      this.serviceLogic.setCliente(cliente);
      this.store.dispatch(StateResClienteDTOAction.setClienteDTO({ resClienteDTO: cliente }));
      this.error = null;

      this.close();
    } catch (e) {
      console.log("Error: ",e)
      this.error = "Error al buscar cliente"
      this.loading = false;

    }
  }

  close(): void {
    if(this.dialogRef){
      this.loading = false;
      this.dialogRef.close({exitoso:true})
    }
  }
}
