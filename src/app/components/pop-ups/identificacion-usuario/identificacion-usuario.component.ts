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
import { AppSelectors } from '../../../redux/selectors';

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
  storeID: string | undefined;
  branchID: string | undefined;

  constructor(
    private logic: EndpointAdapterLogic,
    private session: SessionLogic,
    private serviceLogic : ServiceLogic,
    private store: Store,
    private navigation : NavigationService,
    private dialogRef: MatDialogRef<IdentificacionUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.store.select(AppSelectors.selectResLoginDTO)
            .subscribe(value => {
              this.storeID = value?.store.id.toString();
              this.branchID = value?.branch.id.toString();
              console.log("BRANCH: ", this.branchID)
              console.log("STORE: ", this.storeID)
    });
  }

  async buscarCliente() {

    this.loading = true;
    try {
      if(this.storeID && this.branchID){
        const cliente = await this.logic.buscarCliente(this.storeID, this.branchID, this.documento);
        if(!cliente){
          this.error= "No existe un cliente con los datos ingresados";
          this.loading = false;
          return;
        }
//         console.log("Cliente---->",cliente)
        this.serviceLogic.setCliente(cliente);
        this.store.dispatch(StateResClienteDTOAction.setClienteDTO({ resClienteDTO: cliente }));
        this.error = null;

        this.close();
      } else{
        this.error="Error buscando cliente"
        this.loading = false;
      }
    } catch (e) {
      console.log("Error: ",e)
      this.error = "No existe un cliente con los datos ingresados"
      this.loading = false;

    }
  }

  close(): void {
    if (this.dialogRef) {
      this.loading = false;
      this.dialogRef.close({
        exitoso: true,
        documento: this.documento // <-- ¡esto es fundamental!
      });
    }
  }

}
