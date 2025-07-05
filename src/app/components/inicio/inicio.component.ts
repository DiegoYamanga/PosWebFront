import { Component } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { HeaderComponent } from "../header/header.component";
import { Store } from '@ngrx/store';
import { StateDocSorteo, StateEncuestasAction, StateFromComponent } from '../../redux/action';
import { SessionLogic } from '../../../logic/sessionLogic';

@Component({
  standalone : true,
  selector: 'app-inicio',
  imports: [HeaderComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  userName: string = ""
  constructor(private navigation: NavigationService,
              private store: Store,
              private sessionLogic: SessionLogic
  ) {
    const userData = this.sessionLogic.getUserData();
    console.log("USEERRRRR: ", userData)
    this.userName = userData.username;
  }

  ngOnInit(){
    this.store.dispatch(StateFromComponent.setFromComponent({ fromComponent: "" }));
    this.store.dispatch(StateDocSorteo.setDocSorteo({ docSorteo: "" }));
    this.store.dispatch(StateEncuestasAction.setEncuestasDisponibles({ encuestas: null }));
    console.log("ENCUESTAS, FROMCOMP y DOCSORTEO BORRADO")  //Para volver a cargar DNI en sorteos y encuestas siempre
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
