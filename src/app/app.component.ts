import { Component, importProvidersFrom, NgModule, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./components/register/register.component";
import { SorteoComponent } from './components/sorteo/sorteo.component';
import { LoginComponent } from './components/login/login.component';
import { HttpService } from './service/HttpService';
import { HttpClientModule } from '@angular/common/http';
import { ServiceLogic } from '../logic/serviceLogic';
import { Store, StoreModule } from '@ngrx/store';
import { reduxReducer } from './redux/reducer';
import { CommonModule } from '@angular/common';
import { SessionLogic } from '../logic/sessionLogic';
import { StateResLoginDTOAction } from './redux/action';
import { NavigationService } from '../logic/navigationService';
// #import { ZXingScannerModule } from '@zxing/ngx-scanner';


@NgModule({
  imports: [StoreModule.forRoot({_STATE_: reduxReducer})],
  providers: [
    HttpService,
    importProvidersFrom(HttpClientModule),
    ServiceLogic
    // ZXingScannerModule
  ],
  bootstrap: []
})
export class AppModule {}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PosWebFront';

  constructor(
    private sessionLogic: SessionLogic,
    private store: Store,
    private navigation: NavigationService
    
  ) {}

  ngOnInit(): void {
    const userData = this.sessionLogic.getUserData();
    const token = this.sessionLogic.getToken();

    if (userData && token) {
      console.log("📦 Restaurando login desde localStorage...");
      console.log("USER DATA: ", userData)
      this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO: userData }));
      this.navigation.goToInicio()
    } else {
      console.log("⚠️ No hay datos en localStorage");
    }
  }
}

