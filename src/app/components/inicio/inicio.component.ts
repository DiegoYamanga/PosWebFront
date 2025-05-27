import { Component } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { HeaderComponent } from "../header/header.component";

@Component({
  standalone : true,
  selector: 'app-inicio',
  imports: [HeaderComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

constructor(private navigation: NavigationService) {}

  irAFidelidad() {
    this.navigation.irAFidelidad();
  }

  irAGiftCard() {
    this.navigation.goToGiftCard();
  }

  irASorteo() {
    this.navigation.goToSorteo();
  }

  irAEncuesta() {
    // this.navigation.goToEncuesta();
  }

  irAGestion() {
    // Agregá este método cuando tengas ese componente
    console.log('Ir a Gestión');
  }

  irAPagos() {
    // Agregá este método cuando tengas ese componente
    console.log('Ir a Pagos');
  }


}
