import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-numero-ticket',
  imports: [CommonModule,FormsModule],
  templateUrl: './numero-ticket.component.html',
  styleUrl: './numero-ticket.component.css'
})
export class NumeroTicketComponent {

    nroTicket: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<NumeroTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmar() {
    this.dialogRef.close(this.nroTicket);
  }

  cerrar() {
    this.dialogRef.close(null);
  }

}
