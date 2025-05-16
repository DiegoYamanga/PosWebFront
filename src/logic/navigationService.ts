import { Injectable } from "@angular/core";
import { Router } from "@angular/router";



@Injectable({
    providedIn: 'root'
  })
export class NavigationService{

    constructor(private router: Router) {}

    irAFidelidad(): void {
      this.router.navigate(['/fidelidad']);
    }

    goToCompras() {
        this.router.navigate(['/compra']);
      }

    goToSorteo() {
    this.router.navigate(['/sorteo']);
  }

  goToInfCliente(){
    this.router.navigate(['/clienteDatos']);
  }

  goToDNIDetallesOperacion(){
    this.router.navigate(['/dniDetallesOperacion']);
  }

  goToCanje(){
    this.router.navigate(['/canje']);
  }

  goToNotificacion(){
    this.router.navigate(['/notificacion']);
  }

}