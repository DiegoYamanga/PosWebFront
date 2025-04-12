import { createReducer, on, State } from '@ngrx/store';
import { StateComercioAction } from './action';
import { Comercio } from '../components/login/login.component';
import { AppState } from './state';


export const initialState: AppState = {
  comercio: undefined
}



export const reduxReducer = createReducer(
  initialState,
  on(StateComercioAction.setComercio, (state, {comercio}) => {
      return ({...state, comercio: comercio})
    }
  )
);
