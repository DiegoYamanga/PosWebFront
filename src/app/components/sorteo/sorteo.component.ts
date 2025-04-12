import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Comercio, LoginComponent } from '../login/login.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { AppSelectors } from '../../redux/selectors';
import { AppModule } from '../../app.component';


@Component({
  standalone: true,
  selector: 'app-sorteo',
  imports: [CommonModule],
  templateUrl: './sorteo.component.html',
  styleUrl: './sorteo.component.css'
})
export class SorteoComponent {
  comercio$: Observable<Comercio | undefined>;

  constructor(private store: Store,
  ) {
    this.comercio$ = this.store.select(AppSelectors.selectComercio);
  }
}




