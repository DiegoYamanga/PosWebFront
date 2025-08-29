import { Component } from '@angular/core';
import { NavigationService } from '../../../logic/navigationService';
import { HeaderComponent } from "../header/header.component";
import { Store } from '@ngrx/store';
import { StateDocSorteo, StateEncuestasAction, StateFromComponent } from '../../redux/action';
import { SessionLogic } from '../../../logic/sessionLogic';
import { MatDialog } from '@angular/material/dialog';
import { SeleccionarSucursalComponent } from '../pop-ups/seleccionar-sucursal/seleccionar-sucursal.component';
import { resLoginDTO } from '../../../DTOs/resLoginDTO';
import { AppSelectors } from '../../redux/selectors';

@Component({
  standalone : true,
  selector: 'app-inicio',
  imports: [HeaderComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  userName: string = ""
  userData: resLoginDTO | undefined;
  logoBranch: string | undefined;

  constructor(private navigation: NavigationService,
              private store: Store,
              private sessionLogic: SessionLogic,
              private dialog: MatDialog
  ) {
    const userData = this.sessionLogic.getUserData();
    this.userName = userData.username;
  }

  ngOnInit(){
    this.store.dispatch(StateFromComponent.setFromComponent({ fromComponent: "" }));
    this.store.dispatch(StateDocSorteo.setDocSorteo({ docSorteo: "" }));
    this.store.dispatch(StateEncuestasAction.setEncuestasDisponibles({ encuestas: null }));
     this.store.select(AppSelectors.selectResLoginDTO)
            .subscribe(value => {
              this.userData = value;
              this.logoBranch = value?.store.logo_url;
    });

  }

  irAFidelidad() {
    if(this.userData?.isStore){
      const dialogRef = this.dialog.open(SeleccionarSucursalComponent, { width: '400px' });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.navigation.irAFidelidad();
        }
      });
    } else{
      this.navigation.irAFidelidad();
    }
  }

  irAGiftCard() {
    if(this.userData?.isStore){
      const dialogRef = this.dialog.open(SeleccionarSucursalComponent, { width: '400px' });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.navigation.goToGiftCard();
        }
      });
    } else{
      this.navigation.goToGiftCard();
    }
  }

  irASorteo() {
    if(this.userData?.isStore){
      const dialogRef = this.dialog.open(SeleccionarSucursalComponent, { width: '400px' });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.navigation.goToSorteo();
        }
      });
    } else{
      this.navigation.goToSorteo();
    }
  }

  irAEncuesta() {
    if(this.userData?.isStore){
      const dialogRef = this.dialog.open(SeleccionarSucursalComponent, { width: '400px' });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.navigation.goToEncuesta();
        }
      });
    } else{
      this.navigation.goToEncuesta();
    }
  }

  irAGestion() {
    console.log('Ir a Gestión');
  }

  irAPagos() {
    console.log('Ir a Pagos');
  }


}
