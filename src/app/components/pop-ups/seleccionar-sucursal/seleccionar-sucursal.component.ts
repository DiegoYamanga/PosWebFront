import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppSelectors } from '../../../redux/selectors';
import { Store } from '@ngrx/store';
import { BranchDTO } from '../../../../DTOs/brachDTO';
import { resLoginDTO } from '../../../../DTOs/resLoginDTO';
import { StateResLoginDTOAction } from '../../../redux/action';

@Component({
  selector: 'app-seleccionar-sucursal',
  imports: [CommonModule,FormsModule],
  templateUrl: './seleccionar-sucursal.component.html',
  styleUrl: './seleccionar-sucursal.component.css'
})
export class SeleccionarSucursalComponent {
  branchesList: BranchDTO[] | undefined;
  resLogin: resLoginDTO | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { branches: { id: number, name: string }[] },
    private store: Store,
    private dialogRef: MatDialogRef<SeleccionarSucursalComponent>
  ) {
    this.store.select(AppSelectors.selectResLoginDTO)
        .subscribe(value => {
          this.resLogin = value;
          this.branchesList = value?.branches?.branches
        });
  }

  seleccionar(branch: BranchDTO ) {
    if(this.resLogin){
      let resLogNuevo = {...this.resLogin}
      resLogNuevo.branch = branch;
      this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO: resLogNuevo }));
    }

    this.dialogRef.close(branch);
  }

}
