import { Component, importProvidersFrom, NgModule } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./components/register/register.component";
import { SorteoComponent } from './components/sorteo/sorteo.component';
import { LoginComponent } from './components/login/login.component';
import { HttpService } from './service/HttpService';
import { HttpClientModule } from '@angular/common/http';
import { ServiceLogic } from '../logic/serviceLogic';
import { StoreModule } from '@ngrx/store';
import { reduxReducer } from './redux/reducer';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [StoreModule.forRoot({_STATE_: reduxReducer})],
  providers: [
    HttpService,
    importProvidersFrom(),
    ServiceLogic
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
export class AppComponent {
  title = 'PosWebFront';

}
