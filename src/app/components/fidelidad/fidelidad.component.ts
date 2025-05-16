import { Component } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-fidelidad',
  imports: [HeaderComponent],
  templateUrl: './fidelidad.component.html',
  styleUrl: './fidelidad.component.css'
})
export class FidelidadComponent {

  constructor(private navigation: NavigationService) {}

  goToCompras() {
    this.navigation.goToCompras();
  }


  goToSorteo() {
  this.navigation.goToSorteo();
}

  goToCanje() {
  this.navigation.goToCanje();
}

}
