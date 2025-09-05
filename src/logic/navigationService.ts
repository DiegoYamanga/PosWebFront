import { Injectable } from "@angular/core";
import { Router } from "@angular/router";



@Injectable({
    providedIn: 'root'
  })
export class NavigationService{

    constructor(private router: Router) {}

    goToLogin(): void {
      this.router.navigate(['/login']);
    }

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

  goToGiftCard() {
  this.router.navigate(['giftcard']);
  }

  goToInicio() {
  this.router.navigate(['inicio']);
}

  goToTarjetaDetallesOperacion() {
    this.router.navigate(['/tarjetaDetalleOperacion']);
  }

  goToEncuesta() {
    this.router.navigate(['/encuesta']);
  }

  goToQRScanner() {
    this.router.navigate(['/qrScanner']);
  }

  goToEncuestaPreguntas(reqObtenerPregunstasEncuestas : any) {
    this.router.navigate(['/encuestaPreguntas'], reqObtenerPregunstasEncuestas);
  }

  goToAnulacion(){
    this.router.navigate(['/anulacion']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }


}
