import { createAction, createActionGroup, props } from '@ngrx/store';
import { Comercio } from '../components/login/login.component';


export const StateComercioAction = createActionGroup({
  source: 'ComercioState',
  events: {
    'setComercio': props<{ comercio: Comercio }>(),
  },
});
