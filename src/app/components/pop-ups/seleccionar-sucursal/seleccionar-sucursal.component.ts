import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-seleccionar-sucursal',
  imports: [CommonModule,FormsModule],
  templateUrl: './seleccionar-sucursal.component.html',
  styleUrl: './seleccionar-sucursal.component.css'
})
export class SeleccionarSucursalComponent {
    constructor(
    @Inject(MAT_DIALOG_DATA) public data: { branches: { id: number, name: string }[] },
    private dialogRef: MatDialogRef<SeleccionarSucursalComponent>
  ) {}

  seleccionar(branch: { id: number, name: string }) {
    this.dialogRef.close(branch);
  }

}
