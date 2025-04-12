import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { SorteoComponent } from './components/sorteo/sorteo.component';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'sorteo', component: SorteoComponent },
    { path: 'login', component: LoginComponent }
];
