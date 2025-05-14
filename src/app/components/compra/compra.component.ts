import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { Store } from '@ngrx/store';
import { AppSelectors } from '../../redux/selectors';
import { NavigationService } from '../../../logic/navigationService';

@Component({
  standalone: true,
  selector: 'app-compra',
  imports: [CommonModule],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent {
  cliente: ResClienteDTO | undefined;

  constructor(private store: Store,
              private navigationService : NavigationService
  ) {
    this.store.select(AppSelectors.selectResClienteDTO)
    .subscribe(value => {
      console.log("Valueee------>",value);
      this.cliente = value;
    
    });
  }

  accionTarjeta(): void {
    console.log("TARJETA presionado");
  }

  accionQR(): void {
    console.log("QR presionado");
  }

  goToIdentificacionUsuario(): void {
    this.navigationService.goToInfCliente();
  }


}
