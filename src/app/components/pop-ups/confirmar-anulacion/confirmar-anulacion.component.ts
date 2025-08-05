import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-anulacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-anulacion.component.html',
  styleUrls: ['./confirmar-anulacion.component.css']
})
export class ConfirmarAnulacionComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarAnulacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {}

  close(confirmed: boolean) {
    this.dialogRef.close(confirmed);
  }
}
