import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { SorteoComponent } from './components/sorteo/sorteo.component';
import { LoginComponent } from './components/login/login.component';
import { FidelidadComponent } from './components/fidelidad/fidelidad.component';
import { CompraComponent } from './components/compra/compra.component';
import { DatosUsuarioComponent } from './components/pop-ups/datos-usuario/datos-usuario.component';
import { IdentificacionUsuarioComponent } from './components/pop-ups/identificacion-usuario/identificacion-usuario.component';
import { DniDetallesOperacionComponent } from './components/dni-detalles-operacion/dni-detalles-operacion.component';
import { CanjeComponent } from './components/canje/canje.component';
import { NotificacionComponent } from './components/notificacion/notificacion.component';
import { GiftCardComponent } from './components/gift-card/gift-card.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { TarjetaDetallesOperacionComponent } from './components/tarjeta-detalles-operacion/tarjeta-detalles-operacion.component';
import { EncuestaComponent } from './components/encuesta/encuesta.component';
import { EncuestaPreguntasComponent } from './components/encuesta-preguntas/encuesta-preguntas.component';
import { QrComponent } from './components/qr/qr.component';


export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'sorteo', component: SorteoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'fidelidad', component: FidelidadComponent },
    { path: 'compra', component: CompraComponent },
    { path: 'clienteDatos', component: IdentificacionUsuarioComponent },
    { path: 'sorteo', component: SorteoComponent },
    { path: 'dniDetallesOperacion', component: DniDetallesOperacionComponent },
    { path: 'canje', component: CanjeComponent },
    { path: 'notificacion', component: NotificacionComponent },
    { path: '', component: LoginComponent},
    { path: 'giftcard', component: GiftCardComponent},
    { path: 'inicio', component:InicioComponent },
    { path: 'tarjetaDetalleOperacion', component:TarjetaDetallesOperacionComponent },
    { path: 'encuesta', component: EncuestaComponent },
    { path: 'encuestaPreguntas', component: EncuestaPreguntasComponent },
    { path: 'qrScanner', component: QrComponent },
];

