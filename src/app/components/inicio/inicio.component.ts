import { Component } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { HeaderComponent } from "../header/header.component";
import { Store } from '@ngrx/store';
import { StateFromComponent } from '../../redux/action';

@Component({
  standalone : true,
  selector: 'app-inicio',
  imports: [HeaderComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  constructor(private navigation: NavigationService,
              private store: Store,
  ) {}

  ngOnInit(){
    this.store.dispatch(StateFromComponent.setFromComponent({ fromComponent: "" }));
    console.log("FROM COMP BORRADO")  //Para volver a cargar DNI en sorteos siempre
  }

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
    this.navigation.goToEncuesta();
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
