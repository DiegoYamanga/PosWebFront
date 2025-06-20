import { Component, Inject, OnInit } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css'
})
export class NotificacionComponent implements OnInit {

  titulo: string = 'Operación exitosa';
  descripcion: string = 'La operación se realizó correctamente.';
  success: boolean = true;
  origen: string = '';

  constructor(
    private navigation : NavigationService,
    public dialogRef: MatDialogRef<NotificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      success: boolean;
      titulo: string;
      descripcion: string;
      origen: string;
    }
  ) {}

ngOnInit() {
  // Tomar los valores inyectados correctamente
  if (this.data) {
    this.titulo = this.data.titulo;
    this.descripcion = this.data.descripcion;
    this.success = this.data.success;
    this.origen = this.data.origen;
  }

  // setTimeout(() => {
  //   this.dialogRef.close(); // cerrar popup
  // }, 4000);
}
goHome(){
  this.navigation.goToInicio();
  this.dialogRef.close();
}



  cerrarPopupYRedirigir() {
    this.dialogRef.close();

    switch (this.origen) {
      case 'GIFTCARD':
        this.navigation.goToGiftCard();
        break;
      case 'FIDELIDAD':
        this.navigation.irAFidelidad();
        break;
      case 'INICIO':
        this.navigation.goToInicio();
        break;
      default:
        this.navigation.goToInicio();
        break;
    }
  }
}
