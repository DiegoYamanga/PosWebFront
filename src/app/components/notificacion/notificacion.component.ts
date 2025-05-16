import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacion',
  imports: [CommonModule],
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css'
})
export class NotificacionComponent implements OnInit{

  @Input() success: boolean = true;

  constructor(private navigation: NavigationService) {}
  

  ngOnInit() {
    setTimeout(() => {
      this.success ? this.goFidelidad() : console.log("FALLO");
    }, 4000);
  }

  goFidelidad(){
    this.navigation.irAFidelidad();
  }

}
