import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { SessionLogic } from '../../../logic/sessionLogic';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() headerTitle: String = "";
  @Input() arrowNavigation: String = "";
  @Input() showArrow: boolean = true;

  constructor(
    private navigation: NavigationService,
    private sessionLogic: SessionLogic
  ){}

  navigate(){
      switch(this.arrowNavigation){
      case 'inicio':
        this.navigation.goToInicio();
        break;
      case 'fidelidad':
        this.navigation.irAFidelidad();
        break;
      case 'giftcard':
        this.navigation.goToInicio();
        break;
      case 'sorteo':
        this.navigation.goToInicio();
        break;
      case 'encuesta':
        this.navigation.goToInicio();
        break;
      default:
        this.navigation.goToInicio();
        break;
    }
  }

  logout(){
    this.sessionLogic.clear();
    this.navigation.goToLogin();
  }

  addUser() {
  this.navigation.goToRegister();
  }

}
