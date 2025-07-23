import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EndpointAdapterLogic } from '../../../../logic/endpointAdapterLogic';
import { ResClienteDTO } from '../../../../DTOs/resClienteDTO';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateResClienteDTOAction } from '../../../redux/action';
import { Store } from '@ngrx/store';
import { ServiceLogic } from '../../../../logic/serviceLogic';
import { NavigationService } from '../../../../logic/navigationService';
import { SessionLogic } from '../../../../logic/sessionLogic';
import { AppSelectors } from '../../../redux/selectors';

@Component({
  standalone: true,
  imports:[CommonModule,FormsModule],
  selector: 'app-tarjeta-usuario',
  templateUrl: './tarjeta-usuario.component.html',
  styleUrl: './tarjeta-usuario.component.css'
})
export class TarjetaUsuarioComponent {
  numeroTarjeta: string = '';
  error: string | null = null;
  loading: boolean = false;
  cliente?: ResClienteDTO;
  cargando: any;
  storeID!: string;
  branchID!: string ;
  indentification!: string;

  constructor(
    private logic: EndpointAdapterLogic,
    private session: SessionLogic,
    private serviceLogic : ServiceLogic,
    private store: Store,
    private navigation : NavigationService,
    private dialogRef: MatDialogRef<TarjetaUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


    ngOnInit(): void {
      this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
        this.cliente = cliente;
      });

  
  
      this.store.select(AppSelectors.selectResLoginDTO).subscribe(loginData => {
        if (loginData) {
          this.storeID = loginData.store.id.toString();
          this.branchID = loginData.branch.id.toString();
        }
      });

    }
  

confirmarTarjeta(): void {
  this.serviceLogic.setCardNumberCompraInfo(this.numeroTarjeta);
  if (!this.numeroTarjeta) {
    this.error = 'Debe ingresar un número de tarjeta.';
    return;
  }

  this.buscarTarjeta();

  this.dialogRef.close({
    exitoso: true,
    nroTarjeta: this.numeroTarjeta
  });
}

  async buscarTarjeta() {
    this.loading = true;

    try {
      console.log("TarjetaUsuario - Voy a buscar cliente")
      const cliente = await this.logic.buscarCliente(this.storeID, this.branchID, this.indentification);
      console.log("TarjetaUsuario - Cliente:",cliente)

      if (!cliente) {
        this.error = "No existe un cliente con los datos ingresados";
        this.loading = false;
        return;
      }

      this.serviceLogic.setCliente(cliente);
      this.store.dispatch(StateResClienteDTOAction.setClienteDTO({ resClienteDTO: cliente }));
      this.error = null;

      this.dialogRef.close({
        exitoso: true,
        nroTarjeta: this.numeroTarjeta
      });
    } catch (e) {
      console.log("Error:", e);
      this.error = "No existe un cliente con los datos ingresados";
    } finally {
      this.loading = false;
    }
  }


  close(): void {
    if (this.dialogRef) {
      this.loading = false;
      this.dialogRef.close({
        exitoso: true,
        nroTarjeta : this.numeroTarjeta
      });
    }
  }
}